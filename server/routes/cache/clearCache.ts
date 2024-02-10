import cache from '../../cache';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    apiKey
  } = req.query;

  if (!apiKey || apiKey !== process.env.SECRET_KEY) {
    return res.json({
      message: 'Invalid API key.'
    });
  }

  cache.clear();

  return res.json({
    success: true
  });
};