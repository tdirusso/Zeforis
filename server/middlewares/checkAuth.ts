import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import type { JWTToken } from '../types/Token';
import { EnvVariable, getEnvVariable } from '../types/EnvVariable';
import { BadRequestError, ErrorMessages, UnauthorizedError } from '../types/Errors';

export default async (req: Request, _: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    throw new UnauthorizedError(ErrorMessages.NoTokenProvided);
  }

  const decoded: JWTToken = jwt.verify(token, getEnvVariable(EnvVariable.SECRET_KEY)) as JWTToken;

  console.log(decoded);
  const userId = decoded.user?.id;

  if (userId) {
    req.userId = userId;
    req.user = decoded.user;
    return next();
  }

  throw new BadRequestError(ErrorMessages.InvalidTokenBody);
};