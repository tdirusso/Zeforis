import { pool } from '../../database';
import { createJWT, wait } from '../../lib/utils';
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { VerifyLoginRequest, VerifyLoginResponse } from '../../../shared/types/api/Auth';
import moment from 'moment';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../types/Errors';
import validator from 'email-validator';
import { User } from '../../../shared/types/User';

export default async (req: Request<{}, {}, VerifyLoginRequest>, res: Response<VerifyLoginResponse>) => {
  const {
    email,
    loginCode
  } = req.body;

  await wait(1500);

  if (!email || !loginCode) {
    throw new BadRequestError('Missing email address or login code.');
  }

  if (!validator.validate(email)) {
    throw new BadRequestError('Invalid email address format.');
  }

  const connection = await pool.getConnection();

  const lowercaseEmail = email.toLowerCase();

  const [userResult] = await connection.query<RowDataPacket[]>(
    `SELECT 
    id, 
    first_name as firstName, 
    last_name as lastName, 
    email, 
    plan, 
    stripe_subscription_status as subscriptionStatus,
    login_code,
    login_code_expiration
    FROM users 
    WHERE email = ?`,
    [lowercaseEmail]
  );

  const user = userResult[0];

  if (!user) {
    connection.release();
    throw new NotFoundError(`User with email ${lowercaseEmail} does not exist.`);
  }

  if (!user.login_code || user.login_code !== loginCode) {
    connection.release();
    throw new UnauthorizedError('Invalid login code.');
  }

  const now = moment();
  const loginCodeExpiration = moment(user.login_code_expiration);

  if (loginCodeExpiration.isBefore(now)) {
    connection.release();
    throw new UnauthorizedError('Login code expired.');
  }

  await connection.query('UPDATE users SET login_code = NULL, login_code_expiration = NULL WHERE id = ?', [user.id]);

  const jwtUser: User = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    plan: user.plan,
    subscriptionStatus: user.subscriptionStatus
  };

  return res.json({ token: createJWT(jwtUser) });
};