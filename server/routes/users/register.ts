import emailService from '../../email';
import validator from "email-validator";
import { v4 as uuidv4 } from 'uuid';
import { OAuth2Client } from 'google-auth-library';
import slackbot from '../../slackbot';
import { pool } from '../../database';
import { getMissingFields } from '../../lib/utils';
import { Request, Response, NextFunction } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const authClient = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

export default async (req: Request, res: Response, next: NextFunction) => {
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
        audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload?.email) {
        return res.status(400).json({ message: 'Missing email from Google credential.' });
      }

      const googleEmail = payload.email.toLowerCase();

      const [userResult] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM users WHERE email = ?',
        [googleEmail]
      );

      const user = userResult[0];

      if (user) {
        return res.sendStatus(204);
      } else {
        await pool.query(
          'INSERT INTO users (first_name, last_name, email) VALUES (?,?,?)',
          [payload.given_name, payload.family_name, googleEmail]);


        await slackbot.post({
          channel: slackbot.channels.events,
          message: `*New User*\n${googleEmail}`
        });

        return res.sendStatus(204);
      }
    } else {
      const lcEmail = email.toLowerCase();

      const [existsResult] = await pool.query<RowDataPacket[]>('SELECT 1 FROM users WHERE email = ?', [lcEmail]);

      if (existsResult.length) {
        return res.status(409).json({
          message: `Email address is already in use.`
        });
      }

      const verificationCode = uuidv4().substring(0, 16);

      const createUserResult = await pool.query<ResultSetHeader>(
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

async function sendVerifyEmail(userId: number, verificationCode: string, email: string) {
  const verificationUrl = `${process.env.API_DOMAIN}/api/users/${userId}/verify?verificationCode=${verificationCode}`;

  await emailService.sendEmailFromTemplate({
    to: email,
    from: emailService.senders.info,
    templateId: 'TODO HERE',
    templateData: {
      verificationUrl
    }
  });
}