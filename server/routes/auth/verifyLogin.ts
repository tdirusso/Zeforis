import { pool } from '../../database';
import { createJWT, setAuthTokenCookie, wait } from '../../lib/utils';
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { VerifyLoginRequest } from '../../../shared/types/Auth';
import moment from 'moment';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../types/Errors';
import validator from 'email-validator';

export default async (req: Request<{}, {}, VerifyLoginRequest>, res: Response) => {
  const {
    email,
    loginCode
  } = req.body;

  await wait(1500);

  if (!email || !loginCode) {
    throw new BadRequestError('Missing required parameter [email].');
  }

  if (!loginCode) {
    throw new BadRequestError('Missing login code.');
  }

  if (!validator.validate(email)) {
    throw new BadRequestError(`Invalid email address format received:  ${email}.`);
  }

  const connection = await pool.getConnection();

  const lowercaseEmail = email.toLowerCase();

  const [userResult] = await connection.query<RowDataPacket[]>(
    `SELECT id, login_code, login_code_expiration FROM users WHERE email = ?`,
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

  const token = createJWT(user.id);

  setAuthTokenCookie(token, res);

  return res.sendStatus(200);
};