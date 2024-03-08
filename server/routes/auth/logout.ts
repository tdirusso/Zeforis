import { pool } from '../../database';
import { createJWT, wait } from '../../lib/utils';
import { Request, Response } from 'express';

export default async (_: Request, res: Response) => {
  res.clearCookie('token');
  return res.sendStatus(204);
};