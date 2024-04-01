import jwt from 'jsonwebtoken';
import { pool } from '../database';
import { Request, Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2';
import type { JWTToken } from '../types/Token';
import { getEnvVariable, EnvVariable } from '../types/EnvVariable';
import { getAuthToken } from '../lib/utils';

export default async (req: Request, res: Response, next: NextFunction) => {

  const token = getAuthToken(req);

  if (!token) {
    return res.json({ message: 'Missing authentication token.' });
  }

  let { engagementId } = req.body;

  if (!engagementId) {
    engagementId = req.query.engagementId;
  }

  if (!engagementId) {
    return res.json({ message: 'No engagementId provided.' });
  }

  try {
    const decoded: JWTToken = jwt.verify(token, getEnvVariable(EnvVariable.SECRET_KEY)) as JWTToken;

    const userId = decoded.user?.id;

    if (engagementId) {
      const [doesEngagementAdminExistResult] = await pool.query<RowDataPacket[]>(
        'SELECT 1 FROM engagement_users WHERE user_id = ? AND engagement_id = ? AND role = "admin"',
        [userId, engagementId]
      );

      const [orgIdForEngagementResult] = await pool.query<RowDataPacket[]>(
        'SELECT org_id FROM engagements WHERE id = ?',
        [engagementId]
      );

      const orgIdForEngagement = orgIdForEngagementResult[0].org_id;

      if (doesEngagementAdminExistResult.length) {
        req.userId = userId;
        req.user = decoded.user;
        req.engagementId = engagementId;
        req.orgId = orgIdForEngagement;

        return next();
      } else {
        return res.json({ message: 'Only administrators in this engagement can perform this operation.' });
      }
    }
  } catch (error) {
    next(error);
  }
};