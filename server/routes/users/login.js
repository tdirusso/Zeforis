const bcrypt = require('bcrypt');
const { pool } = require('../../../database');
const { OAuth2Client } = require('google-auth-library');
const slackbot = require('../../../slackbot');
const { createJWT } = require('../../../lib/utils');

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

const getJWT = user => {
  delete user.password;
  delete user.is_verified;

  return createJWT(user);
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
        SELECT 
          id, 
          is_verified,
          first_name as firstName, 
          last_name as lastName, 
          email, 
          date_created as dateCreated,
          plan, 
          stripe_subscription_status as subscriptionStatus
          FROM users WHERE email = ? AND EXISTS
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

      const token = getJWT(user);
      return res.json({ token });
    } else {
      return res.json({ message: 'You are not a member of this organization.' });
    }
  } else {
    const lcEmail = email.toLowerCase();

    const [userResult] = await pool.query(
      `
        SELECT 
          password, 
          id,
          is_verified, 
          first_name as firstName, 
          last_name as lastName, 
          email, 
          date_created as dateCreated, 
          plan, 
          stripe_subscription_status as subscriptionStatus
          FROM users WHERE email = ? AND EXISTS
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
        const token = getJWT(user);
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
      'SELECT id, is_verified, first_name as firstName, last_name as lastName, email, date_created as dateCreated, plan, stripe_subscription_status as subscriptionStatus FROM users WHERE email = ?',
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

      const token = getJWT(user);
      return res.json({ token });
    } else {
      const createUserResult = await pool.query(
        'INSERT INTO users (first_name, last_name, email, is_verified) VALUES (?,?,?,1)',
        [payload.given_name, payload.family_name, googleEmail]);

      await slackbot.post({
        channel: slackbot.channels.events,
        message: `*New User*\n${googleEmail}`
      });

      const newUser = {
        id: createUserResult[0].insertId,
        email: googleEmail,
        firstName: payload.given_name,
        lastName: payload.family_name,
        dateCreated: new Date().toISOString(),
        plan: 'free'
      };

      const token = getJWT(newUser);

      return res.json({ token });
    }
  } else {
    const lcEmail = email.toLowerCase();

    const [userResult] = await pool.query(
      'SELECT id, is_verified, first_name as firstName, last_name as lastName, email, date_created as dateCreated, password, plan, stripe_subscription_status as subscriptionStatus FROM users WHERE email = ?',
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

        const token = getJWT(user);
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