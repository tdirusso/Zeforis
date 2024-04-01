import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import type { JWTToken } from '../types/Token';
import { EnvVariable, getEnvVariable } from '../types/EnvVariable';
import { BadRequestError, ErrorMessages, UnauthorizedError } from '../types/Errors';
import { getAuthToken } from '../lib/utils';

export default async (req: Request, _: Response, next: NextFunction) => {
  const token = getAuthToken(req);

  if (!token) {
    throw new UnauthorizedError(ErrorMessages.NoTokenProvided);
  }

  const decoded: JWTToken = jwt.verify(token, getEnvVariable(EnvVariable.SECRET_KEY)) as JWTToken;

  const user = decoded.user;

  if (user) {
    req.userId = user.id;
    req.user = user;
    return next();
  }

  throw new BadRequestError(ErrorMessages.InvalidTokenBody);
};