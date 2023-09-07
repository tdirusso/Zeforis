const bcrypt = require('bcrypt');
const emailService = require('../../../email');
const validator = require("email-validator");
const { v4: uuidv4 } = require('uuid');
const { OAuth2Client } = require('google-auth-library');
const { slackbotClient } = require('../../../slackbot');

const { pool } = require('../../../database');

const slackEventsChannelId = 'C05ML3A3DC3';

const authClient = new OAuth2Client(process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID);

module.exports = async (req, res, next) => {
  const {
    email,
    firstName,
    lastName,
    password,
    googleCredential
  } = req.body;

  if ((!email || !password || !firstName || !lastName) && !googleCredential) {
    return res.json({
      message: 'Missing registration parameters.'
    });
  }

  if (email && !validator.validate(email)) {
    return res.json({ message: 'Email address is not valid.' });
  }

  try {
    if (googleCredential) {
      const ticket = await authClient.verifyIdToken({
        idToken: googleCredential,
        audience: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const googleEmail = payload.email.toLowerCase();

      const [userResult] = await pool.query(
        'SELECT id, is_verified FROM users WHERE email = ?',
        [googleEmail]
      );

      const user = userResult[0];

      if (user) {
        if (!user.is_verified) {
          await pool.query(
            'UPDATE users SET is_verified = 1 WHERE id = ?',
            [user.id]
          );
        }

        return res.json({ success: true });
      } else {
        await pool.query(
          'INSERT INTO users (first_name, last_name, email, is_verified) VALUES (?,?,?,1)',
          [payload.given_name, payload.family_name, googleEmail]);

        await slackbotClient.chat.postMessage({
          text: `*New Zeforis User*\n${googleEmail}`,
          channel: slackEventsChannelId
        });

        return res.json({ success: true });
      }
    } else {
      const lcEmail = email.toLowerCase();

      const [existsResult] = await pool.query('SELECT 1 FROM users WHERE email = ?', [lcEmail]);

      if (existsResult.length) {
        return res.json({
          message: `"${email}" is already in use.  Please sign in instead.`
        });
      }

      const verificationCode = uuidv4().substring(0, 16);

      const hashedPassword = await bcrypt.hash(password, 10);

      const createUserResult = await pool.query(
        'INSERT INTO users (first_name, last_name, email, password, verification_code) VALUES (?,?,?,?,?)',
        [firstName, lastName, lcEmail, hashedPassword, verificationCode]);

      const userId = createUserResult[0].insertId;

      await sendVerifyEmail(userId, verificationCode, lcEmail);

      await slackbotClient.chat.postMessage({
        text: `*New Zeforis User*\n${lcEmail}`,
        channel: slackEventsChannelId
      });

      return res.json({ success: true });
    }
  } catch (error) {
    next(error);
  }
};

async function sendVerifyEmail(userId, verificationCode, email) {
  const qs = `userId=${userId}&verificationCode=${verificationCode}`;

  const verificationUrl = `${process.env.REACT_APP_API_DOMAIN}/api/users/verify?${qs}`;

  await emailService.sendEmailFromTemplate({
    to: email,
    from: emailService.senders.info,
    templateId: emailService.templates.emailVerification,
    templateData: {
      verificationUrl
    }
  });
}