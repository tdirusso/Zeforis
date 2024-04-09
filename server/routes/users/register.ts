import emailer from '../../email';
import validator from "email-validator";
import { OAuth2Client } from 'google-auth-library';
import slackbot from '../../slackbot';
import { pool } from '../../database';
import { getMissingFields } from '../../lib/utils';
import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { BadRequestError, ConflictError, UnprocessableError } from '../../types/Errors';
import type { RegisterRequest } from '../../../shared/types/User';

const authClient = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

export default async (req: Request<{}, {}, RegisterRequest>, res: Response<void>) => {
  const {
    email,
    firstName,
    lastName,
    googleCredential
  } = req.body;

  const missingFields = getMissingFields(['email', 'firstName', 'lastName'], req.body);

  if (missingFields.length > 0 && !googleCredential) {
    throw new BadRequestError(`Missing required parameters: [${missingFields.join(', ')}]`);
  }

  if (email && !validator.validate(email)) {
    throw new UnprocessableError('Invalid email format received.');
  }

  if (googleCredential) {
    const ticket = await authClient.verifyIdToken({
      idToken: googleCredential,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw new BadRequestError('Missing email from googleCredential.');
    }

    const googleEmail = payload.email.toLowerCase();

    const [userResult] = await pool.query<RowDataPacket[]>(
      'SELECT 1 FROM users WHERE email = ?',
      [googleEmail]
    );

    if (userResult.length) {
      throw new ConflictError(`Email ${googleEmail} already in use.`);
    }

    await pool.query(
      'INSERT INTO users (first_name, last_name, email) VALUES (?,?,?)',
      [payload.given_name, payload.family_name, googleEmail]);

    await emailer.sendLoginLinkEmail(googleEmail);

    await slackbot.post({
      channel: slackbot.channels.events,
      message: `*New User*\n${googleEmail}`
    });

    return res.sendStatus(204);
  } else {
    const lcEmail = email!.toLowerCase();

    const [existsResult] = await pool.query<RowDataPacket[]>('SELECT 1 FROM users WHERE email = ?', [lcEmail]);

    if (existsResult.length) {
      throw new ConflictError(`Email ${email} is already in use.`);
    }

    await pool.query<ResultSetHeader>(
      'INSERT INTO users (first_name, last_name, email) VALUES (?,?,?)',
      [firstName, lastName, lcEmail]);

    await emailer.sendLoginLinkEmail(lcEmail);

    await slackbot.post({
      channel: slackbot.channels.events,
      message: `*New User*\n${lcEmail}`
    });

    return res.sendStatus(204);
  }
};