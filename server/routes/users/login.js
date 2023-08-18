const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../../../database');
const { OAuth2Client } = require('google-auth-library');
const { slackbotClient } = require('../../../slackbot');

const slackEventsChannelId = 'C05ML3A3DC3';

const authClient = new OAuth2Client(process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID);

module.exports = async (req, res, next) => {
  const {
    isFromCustomLoginPage = false
  } = req.body;

  try {
    if (isFromCustomLoginPage) {
      await handleCustomPageLogin(req, res, next);
    } else {
      await handleUniversalLogin(req, res, next);
    }
  } catch (error) {
    next(error);
  }
};

const createToken = user => {
  return jwt.sign(
    {
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        dateCreated: user.date_created
      }
    },
    process.env.SECRET_KEY,
    { expiresIn: 3600 }
  );
};

async function handleCustomPageLogin(req, res) {
  const {
    email,
    password,
    googleCredential,
    orgId
  } = req.body;

  if ((!email || !password) && !googleCredential) {
    return res.json({
      message: 'Missing credentials, please try again.'
    });
  }

  if (googleCredential) {
    const ticket = await authClient.verifyIdToken({
      idToken: googleCredential,
      audience: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleEmail = payload.email.toLowerCase();

    const [userResult] = await pool.query(
      `
        SELECT id, is_verified, first_name, last_name, email, date_created FROM users WHERE email = ? AND EXISTS
        (
          SELECT 1 FROM engagement_users 
          JOIN engagements ON engagements.id = engagement_users.engagement_id
          JOIN users ON users.id = engagement_users.user_id
          WHERE engagements.org_id = ? and users.email = ?
        )
        `,
      [googleEmail, orgId, googleEmail]
    );

    const user = userResult[0];

    if (user) {
      if (!user.is_verified) {
        await pool.query(
          'UPDATE users SET is_verified = 1 WHERE id = ?',
          [user.id]
        );
      }

      const token = createToken(user);
      return res.json({ token });
    } else {
      return res.json({ message: 'You are not a member of this organization.' });
    }
  } else {
    const lcEmail = email.toLowerCase();

    const [userResult] = await pool.query(
      `
        SELECT password, id, is_verified, first_name, last_name, email, date_created FROM users WHERE email = ? AND EXISTS
        (
          SELECT 1 FROM engagement_users 
          JOIN engagements ON engagements.id = engagement_users.engagement_id
          JOIN users ON users.id = engagement_users.user_id
          WHERE engagements.org_id = ? and users.email = ?
        )
        `,
      [lcEmail, orgId, lcEmail]
    );

    const user = userResult[0];

    if (user) {
      if (!user.password) {
        return res.json({
          message: `No password set for ${lcEmail} - try Google or password reset.`
        });
      }

      const match = await bcrypt.compare(password, user.password);

      if (match) {
        if (!user.is_verified) {
          return res.json({
            unverified: true,
            message: 'Please verify your email address.'
          });
        }
        const token = createToken(user);
        return res.json({ token });
      }

      return res.json({
        message: 'Incorrect username or password.  Please try again.'
      });
    } else {
      return res.json({ message: 'You are not a member of this organization.' });
    }
  }
}

async function handleUniversalLogin(req, res) {
  const {
    email,
    password,
    googleCredential
  } = req.body;

  if ((!email || !password) && !googleCredential) {
    return res.json({
      message: 'Missing credentials, please try again.'
    });
  }


  if (googleCredential) {
    const ticket = await authClient.verifyIdToken({
      idToken: googleCredential,
      audience: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleEmail = payload.email.toLowerCase();

    const [userResult] = await pool.query(
      'SELECT id, is_verified, first_name, last_name, email, date_created FROM users WHERE email = ?',
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

      const token = createToken(user);
      return res.json({ token });
    } else {
      const createUserResult = await pool.query(
        'INSERT INTO users (first_name, last_name, email, is_verified) VALUES (?,?,?,1)',
        [payload.given_name, payload.family_name, googleEmail]);

      await slackbotClient.chat.postMessage({
        text: `*New Zeforis User*\n${googleEmail}`,
        channel: slackEventsChannelId
      });

      const newUser = {
        id: createUserResult[0].insertId,
        email: googleEmail,
        first_name: payload.given_name,
        last_name: payload.family_name,
        date_created: new Date().toISOString(),
      };

      const token = createToken(newUser);

      return res.json({ token });
    }
  } else {
    const lcEmail = email.toLowerCase();

    const [userResult] = await pool.query(
      'SELECT id, is_verified, first_name, last_name, email, date_created, password FROM users WHERE email = ?',
      [lcEmail]
    );

    const user = userResult[0];

    if (user) {
      if (!user.password) {
        return res.json({
          message: `No password set for ${lcEmail} - try Google or password reset.`
        });
      }
      
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        if (!user.is_verified) {
          return res.json({
            unverified: true,
            message: 'Please verify your email address.'
          });
        }

        const token = createToken(user);
        return res.json({ token });
      }

      return res.json({
        message: 'Incorrect username or password.  Please try again.'
      });
    }

    return res.json({
      message: `Incorrect username or password.  Please try again.`
    });
  }
}