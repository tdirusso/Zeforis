import { pool } from '../../database';
import { OAuth2Client } from 'google-auth-library';
import slackbot from '../../slackbot';
import { createJWT } from '../../lib/utils';
import { Request, Response, NextFunction } from 'express';
import { EnvVariable, getEnvVariable } from '../../types/EnvVariable';
import { User } from '../../../shared/types/User';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const authClient = new OAuth2Client(getEnvVariable(EnvVariable.GOOGLE_OAUTH_CLIENT_ID));

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    isFromCustomLoginPage = false
  } = req.body;

  try {
    if (isFromCustomLoginPage) {
      await handleCustomPageLogin(req, res);
    } else {
      await handleUniversalLogin(req, res);
    }
  } catch (error) {
    next(error);
  }
};

const getJWT = (user: User) => {
  return createJWT(user);
};

async function handleCustomPageLogin(req: Request, res: Response) {
  const {
    email,
    googleCredential,
    orgId
  } = req.body;

  if ((!email) && !googleCredential) {
    return res.json({
      message: 'Missing credentials, please try again.'
    });
  }

  if (googleCredential) {
    const ticket = await authClient.verifyIdToken({
      idToken: googleCredential,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ message: 'Missing email from Google credential.' });
    }

    const googleEmail = payload.email.toLowerCase();

    const [userResult] = await pool.query<RowDataPacket[]>(
      `
        SELECT 
          id, 
          first_name as firstName, 
          last_name as lastName, 
          email, 
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

    if (!userResult[0]) {
      return res.status(403).json({ message: 'You are not a member of this organization.' });
    }

    const user: User = {
      id: userResult[0].id,
      firstName: userResult[0].firstName,
      lastName: userResult[0].lastName,
      email: userResult[0].email,
      plan: userResult[0].plan,
      subscriptionStatus: userResult[0].subscriptionStatus,
    };

    const token = getJWT(user);
    return res.json({ token });

  } else {
    const lcEmail = email.toLowerCase();

    const [userResult] = await pool.query<RowDataPacket[]>(
      `
        SELECT 
          id,
          first_name as firstName, 
          last_name as lastName, 
          email, 
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
      //TODO login logic
    } else {
      return res.json({ message: 'You are not a member of this organization.' });
    }
  }
}

async function handleUniversalLogin(req: Request, res: Response) {
  const {
    email,
    googleCredential
  } = req.body;

  if ((!email) && !googleCredential) {
    return res.json({
      message: 'Missing credentials, please try again.'
    });
  }

  if (googleCredential) {
    const ticket = await authClient.verifyIdToken({
      idToken: googleCredential,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ message: 'Missing email from Google credential.' });
    }

    const googleEmail = payload.email.toLowerCase();

    const [userResult] = await pool.query<RowDataPacket[]>(
      'SELECT id, first_name as firstName, last_name as lastName, email, plan, stripe_subscription_status as subscriptionStatus FROM users WHERE email = ?',
      [googleEmail]
    );

    if (!userResult[0]) {
      return res.status(403).json({ message: 'You are not a member of this organization.' });
    }

    const user: User = {
      id: userResult[0].id,
      firstName: userResult[0].firstName,
      lastName: userResult[0].lastName,
      email: userResult[0].email,
      plan: userResult[0].plan,
      subscriptionStatus: userResult[0].subscriptionStatus,
    };

    if (user) {
      const token = getJWT(user);
      return res.json({ token });
    } else {
      const createUserResult = await pool.query<ResultSetHeader>(
        'INSERT INTO users (first_name, last_name, email) VALUES (?,?,?)',
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
        plan: 'free'
      };

      const token = getJWT(newUser);

      return res.json({ token });
    }
  } else {
    const lcEmail = email.toLowerCase();

    const [userResult] = await pool.query<RowDataPacket[]>(
      'SELECT id, first_name as firstName, last_name as lastName, email, plan, stripe_subscription_status as subscriptionStatus FROM users WHERE email = ?',
      [lcEmail]
    );

    const user = userResult[0];

    if (user) {

    }

    return res.json({
      message: `Incorrect username or p.  Please try again.`
    });
  }
}