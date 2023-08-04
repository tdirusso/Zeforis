const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../../database');
const { OAuth2Client } = require('google-auth-library');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

const authClient = new OAuth2Client(process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID);

module.exports = async (req, res) => {
  const {
    isFromCustomLoginPage = false
  } = req.body;

  if (isFromCustomLoginPage) {
    handleCustomPageLogin(req, res);
  } else {
    handleUniversalLogin(req, res);
  }
};

const createToken = userId => {
  return jwt.sign(
    {
      user: {
        id: userId
      }
    },
    process.env.SECRET_KEY,
    { expiresIn: 86400 }
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

  try {
    if (googleCredential) {
      const ticket = await authClient.verifyIdToken({
        idToken: googleCredential,
        audience: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const googleEmail = payload.email;

      const [userResult] = await pool.query(
        `
        SELECT id, is_verified FROM users WHERE email = ? AND EXISTS
        (
          SELECT 1 FROM engagement_users 
          JOIN engagements ON engagements.id = engagement_users.engagement_id
          JOIN users ON users.id = engagement_users.user_id
          WHERE engagements.org_id = ? and users.email = ?
        )
        `,
        [googleEmail.toLowerCase(), orgId, googleEmail.toLowerCase()]
      );

      const user = userResult[0];

      if (user) {
        if (!user.is_verified) {
          await pool.query(
            'UPDATE users SET is_verified = 1 WHERE id = ?',
            [user.id]
          );
        }

        const token = createToken(user.id);
        return res.json({ token });
      } else {
        return res.json({ message: 'You are not a member of this organization.' });
      }
    } else {
      const [userResult] = await pool.query(
        `
        SELECT password, id, is_verified FROM users WHERE email = ? AND EXISTS
        (
          SELECT 1 FROM engagement_users 
          JOIN engagements ON engagements.id = engagement_users.engagement_id
          JOIN users ON users.id = engagement_users.user_id
          WHERE engagements.org_id = ? and users.email = ?
        )
        `,
        [email.toLowerCase(), orgId, email.toLowerCase()]
      );

      const user = userResult[0];

      if (user) {
        const match = await bcrypt.compare(password, user.password);

        if (match) {
          if (!user.is_verified) {
            return res.json({
              unverified: true,
              message: 'Please verify your email address.'
            });
          }
          const token = createToken(user.id);
          return res.json({ token });
        }

        return res.json({
          message: 'Incorrect username or password.  Please try again.'
        });
      } else {
        return res.json({ message: 'You are not a member of this organization.' });
      }
    }
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
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

  try {
    if (googleCredential) {
      const ticket = await authClient.verifyIdToken({
        idToken: googleCredential,
        audience: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const googleEmail = payload.email;

      const [userResult] = await pool.query(
        'SELECT id, is_verified FROM users WHERE email = ?',
        [googleEmail.toLowerCase()]
      );

      const user = userResult[0];

      if (user) {
        if (!user.is_verified) {
          await pool.query(
            'UPDATE users SET is_verified = 1 WHERE id = ?',
            [user.id]
          );
        }

        const token = createToken(user.id);
        return res.json({ token });
      } else {
        const createUserResult = await pool.query(
          'INSERT INTO users (first_name, last_name, email, is_verified) VALUES (?,?,?,1)',
          [payload.given_name, payload.family_name, googleEmail.toLowerCase()]);

        const userId = createUserResult[0].insertId;
        const token = createToken(userId);

        return res.json({ token });
      }
    } else {
      const [userResult] = await pool.query(
        'SELECT id, is_verified, password FROM users WHERE email = ?',
        [email.toLowerCase()]
      );

      const user = userResult[0];

      if (user) {
        const match = await bcrypt.compare(password, user.password);

        if (match) {
          if (!user.is_verified) {
            return res.json({
              unverified: true,
              message: 'Please verify your email address.'
            });
          }
          const token = createToken(user.id);
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
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
}