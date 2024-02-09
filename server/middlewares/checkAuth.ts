import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import type { JWTToken } from '../types/Token';
import type { CheckAuthRequest } from '../types/Request';
import { EnvVariable, getEnvVariable } from '../types/EnvVariable';

export default async (req: CheckAuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.json({ message: 'Missing authentication token.' });
  }

  if (typeof token !== 'string') {
    return res.status(400).json({ message: 'Incorrect type for header "x-access-token supplied, string required."' });
  }

  try {
    const decoded: JWTToken = jwt.verify(token, getEnvVariable(EnvVariable.SECRET_KEY)) as JWTToken;

    const userId = decoded.user?.id;

    if (userId) {
      req.userId = userId;
      req.userObject = decoded.user;
      return next();
    }

    return res.json({ message: 'Invalid token.' });
  } catch (error) {
    next(error);
  }
};