const emailService = require('../../../email');
const validator = require("email-validator");
const { v4: uuidv4 } = require('uuid');
const { OAuth2Client } = require('google-auth-library');
const slackbot = require('../../../slackbot');

const { pool } = require('../../../database');
const { getMissingFields } = require('../../../lib/utils');

const authClient = new OAuth2Client(process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID);

module.exports = async (req, res, next) => {
  const {
    email,
    firstName,
    lastName,
    googleCredential
  } = req.body;

  const missingFields = getMissingFields(['email', 'firstName', 'lastName'], req.body, true);

  if (missingFields.length > 0 && !googleCredential) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  if (email && !validator.validate(email)) {
    return res.status(422).json({ message: 'Email address is not in a valid format.' });
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

        return res.sendStatus(204);
      } else {
        await pool.query(
          'INSERT INTO users (first_name, last_name, email, is_verified) VALUES (?,?,?,1)',
          [payload.given_name, payload.family_name, googleEmail]);


        await slackbot.post({
          channel: slackbot.channels.events,
          message: `*New User*\n${googleEmail}`
        });

        return res.sendStatus(204);
      }
    } else {
      const lcEmail = email.toLowerCase();

      const [existsResult] = await pool.query('SELECT 1 FROM users WHERE email = ?', [lcEmail]);

      if (existsResult.length) {
        return res.status(409).json({
          message: `Email address is already in use.`
        });
      }

      const verificationCode = uuidv4().substring(0, 16);

      const createUserResult = await pool.query(
        'INSERT INTO users (first_name, last_name, email, verification_code) VALUES (?,?,?,?)',
        [firstName, lastName, lcEmail, verificationCode]);

      const userId = createUserResult[0].insertId;

      await sendVerifyEmail(userId, verificationCode, lcEmail);

      await slackbot.post({
        channel: slackbot.channels.events,
        message: `*New User*\n${lcEmail}`
      });

      return res.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
};

async function sendVerifyEmail(userId, verificationCode, email) {
  const verificationUrl = `${process.env.REACT_APP_API_DOMAIN}/api/users/${userId}/verify?verificationCode=${verificationCode}`;

  await emailService.sendEmailFromTemplate({
    to: email,
    from: emailService.senders.info,
    templateId: emailService.templates.emailVerification,
    templateData: {
      verificationUrl
    }
  });
}