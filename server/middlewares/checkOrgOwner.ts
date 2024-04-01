import jwt from 'jsonwebtoken';
import { pool } from '../database';
import { Request, Response, NextFunction } from 'express';
import { EnvVariable, getEnvVariable } from '../types/EnvVariable';
import { JWTToken } from '../types/Token';
import { RowDataPacket } from 'mysql2';
import { getAuthToken } from '../lib/utils';

export default async (req: Request, res: Response, next: NextFunction) => {
  const token = getAuthToken(req);

  if (!token) {
    return res.json({ message: 'No authentication token provided.' });
  }

  let orgId = req.params.orgId || req.body.orgId || req.query.orgId;
  let engagementId = req.params.engagementId || req.body.engagementId || req.query.engagementId;

  if (!orgId && !engagementId) {
    return res.json({ message: 'No ID provided for engagement or org.' });
  }

  try {
    const decoded: JWTToken = jwt.verify(token, getEnvVariable(EnvVariable.SECRET_KEY)) as JWTToken;

    const userId = decoded.user?.id;

    let ownerOfOrgResult;

    if (orgId) {
      [ownerOfOrgResult] = await pool.query<RowDataPacket[]>(
        'SELECT id, name FROM orgs WHERE id = ? AND owner_id = ?',
        [orgId, userId]
      );
    } else {
      [ownerOfOrgResult] = await pool.query<RowDataPacket[]>(
        `SELECT orgs.id, orgs.name
         FROM orgs
         JOIN engagements ON orgs.id = engagements.org_id
         WHERE engagements.id = ?
         AND orgs.owner_id = ?`,
        [engagementId, userId]
      );
    }

    if (ownerOfOrgResult.length) {
      req.userId = userId;
      req.user = decoded.user;
      req.ownedOrg = {
        id: ownerOfOrgResult[0].id,
        name: ownerOfOrgResult[0].name
      };
      return next();
    } else {
      return res.json({ message: 'Only the org owner can perform this operation.' });
    }
  } catch (error) {
    next(error);
  }
};