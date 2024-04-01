import { Request, Response } from 'express';

export default async (_: Request, res: Response<void>) => {
  res.clearCookie('token');
  return res.sendStatus(204);
};