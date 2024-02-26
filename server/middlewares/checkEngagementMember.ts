import jwt from 'jsonwebtoken';
import { pool } from '../database';
import { Request, Response, NextFunction } from 'express';
import { EnvVariable, getEnvVariable } from '../types/EnvVariable';
import { JWTToken } from '../types/Token';
import { RowDataPacket } from 'mysql2';
import { UnauthorizedError } from '../types/Errors';

export default async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    throw new UnauthorizedError('No JWT token provided.');
  }

  if (typeof token !== 'string') {
    return res.status(400).json({ message: 'Incorrect type for header "x-access-token supplied, string required."' });
  }

  let { engagementId } = req.body;

  if (!engagementId) {
    engagementId = req.query.engagementId;
  }

  if (!engagementId) {
    return res.json({ message: 'No engagementId provided.' });
  }

  let { orgId } = req.body;

  if (!orgId) {
    orgId = req.query.orgId;
  }

  try {
    const decoded: JWTToken = jwt.verify(token, getEnvVariable(EnvVariable.SECRET_KEY)) as JWTToken;

    const userId = decoded.user?.id;

    if (engagementId) {
      const [doesEngagementUserExistResult] = await pool.query<RowDataPacket[]>(
        'SELECT 1 FROM engagement_users WHERE user_id = ? AND engagement_id = ?',
        [userId, engagementId]
      );

      if (doesEngagementUserExistResult.length) {
        if (orgId) {
          const [orgIdForEngagementResult] = await pool.query<RowDataPacket[]>(
            'SELECT org_id FROM engagements WHERE id = ?',
            [engagementId]
          );

          const orgIdForEngagement = orgIdForEngagementResult[0].org_id;

          if (orgIdForEngagement !== Number(orgId)) {
            return res.json({ message: 'Engagement and org mismatch.' });
          }
        }

        req.userId = userId;
        req.user = decoded.user;
        req.engagementId = engagementId;
        req.orgId = orgId;
        return next();
      } else {
        return res.json({ message: 'You are not a member of this engagement.' });
      }
    }
  } catch (error) {
    next(error);
  }
};