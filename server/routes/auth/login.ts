import { pool } from '../../database';
import { OAuth2Client } from 'google-auth-library';
import slackbot from '../../slackbot';
import { createJWT, wait } from '../../lib/utils';
import { Request, Response } from 'express';
import { EnvVariable, getEnvVariable } from '../../types/EnvVariable';
import { User } from '../../../shared/types/User';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import type { LoginResponse, LoginRequest } from '../../../shared/types/api/Auth';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../types/Errors';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import emailer from '../../email';

const authClient = new OAuth2Client(getEnvVariable(EnvVariable.GOOGLE_OAUTH_CLIENT_ID));

type APILoginRequest = Request<{}, {}, LoginRequest>;
type APILoginResponse = Response<LoginResponse>;

export default async (req: APILoginRequest, res: APILoginResponse) => {
  const {
    isFromCustomLoginPage
  } = req.body;

  await wait(1500);

  if (isFromCustomLoginPage) {
    await handleCustomPageLogin(req, res);
  } else {
    await handleUniversalLogin(req, res);
  }
};

const getJWT = (user: User) => {
  return createJWT(user);
};

async function handleCustomPageLogin(req: APILoginRequest, res: APILoginResponse) {
  const {
    email,
    googleCredential,
    orgId
  } = req.body;

  if ((!email) && !googleCredential) {
    throw new BadRequestError('Missing credentials, please try again.');
  }

  if (googleCredential) {
    const ticket = await authClient.verifyIdToken({
      idToken: googleCredential,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw new BadRequestError('Email is missing from Google Credential.');
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
      throw new ForbiddenError('You are not a member of this organization.');
    }

    const user: User = {
      id: userResult[0].id,
      firstName: userResult[0].firstName,
      lastName: userResult[0].lastName,
      email: userResult[0].email,
      plan: userResult[0].plan,
      subscriptionStatus: userResult[0].subscriptionStatus,
    };

    return res.json({ token: createJWT(user) });

  } else {
    const lcEmail = email!.toLowerCase();

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
      await sendLoginLink(user.id, user.email);
      return res.sendStatus(200);
    } else {
      throw new ForbiddenError('You are not a member of this organization.');
    }
  }
}

async function handleUniversalLogin(req: APILoginRequest, res: APILoginResponse) {
  const {
    email,
    googleCredential
  } = req.body;

  if ((!email) && !googleCredential) {
    throw new BadRequestError('No email or Google Credential was provided.');
  }

  if (googleCredential) {
    const ticket = await authClient.verifyIdToken({
      idToken: googleCredential,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw new BadRequestError('Email is missing from Google Credential.');
    }

    const googleEmail = payload.email.toLowerCase();

    const [userResult] = await pool.query<RowDataPacket[]>(
      'SELECT id, first_name as firstName, last_name as lastName, email, plan, stripe_subscription_status as subscriptionStatus FROM users WHERE email = ?',
      [googleEmail]
    );

    if (userResult.length) {
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
      const createUserResult = await pool.query<ResultSetHeader>(
        'INSERT INTO users (first_name, last_name, email) VALUES (?,?,?)',
        [payload.given_name, payload.family_name, googleEmail]);

      await slackbot.post({
        channel: slackbot.channels.events,
        message: `*New User*\n${googleEmail}`
      });

      const newUser: User = {
        id: createUserResult[0].insertId,
        email: googleEmail,
        firstName: payload.given_name,
        lastName: payload.family_name,
        plan: 'free'
      };

      return res.json({ token: createJWT(newUser) });
    }
  } else {
    const lcEmail = email!.toLowerCase();

    const [userResult] = await pool.query<RowDataPacket[]>(
      'SELECT id, email FROM users WHERE email = ?',
      [lcEmail]
    );

    const user = userResult[0];

    if (user) {
      await sendLoginLink(user.id, user.email);
      return res.sendStatus(200);
    } else {
      throw new NotFoundError(`No account was found with email ${lcEmail}.`);
    }
  }
}

async function sendLoginLink(userId: number, email: string) {
  const loginCode = uuidv4().substring(0, 24);
  const _15minutesFromNow = moment().add('15', 'minutes');

  await pool.query('UPDATE users SET login_code = ?, login_code_expiration = ? WHERE id = ?',
    [loginCode, _15minutesFromNow.toDate(), userId]
  );

  await emailer.sendLoginLinkEmail(email, loginCode);
}