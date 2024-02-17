import cache from '../../cache';
import { Request, Response, NextFunction } from 'express';
import { EnvVariable, getEnvVariable } from '../../types/EnvVariable';

const appSecret = getEnvVariable(EnvVariable.SECRET_KEY);

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    apiKey
  } = req.query;

  if (!apiKey || apiKey !== appSecret) {
    return res.json({
      message: 'Invalid API key.'
    });
  }

  return res.json(cache.dump());
};