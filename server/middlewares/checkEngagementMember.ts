import jwt from 'jsonwebtoken';
import { pool } from '../database';
import { Request, Response, NextFunction } from 'express';
import { EnvVariable, getEnvVariable } from '../types/EnvVariable';
import { JWTToken } from '../types/Token';
import { RowDataPacket } from 'mysql2';
import { BadRequestError, ErrorMessages, ForbiddenError, NotFoundError, UnauthorizedError } from '../types/Errors';
import { getAuthToken, getRequestParameter } from '../lib/utils';

export default async (req: Request, _: Response, next: NextFunction) => {
  const token = getAuthToken(req);

  if (!token) {
    throw new UnauthorizedError(ErrorMessages.NoTokenProvided);
  }

  const engagementId = getRequestParameter('engagementId', req);

  if (!engagementId) {
    throw new BadRequestError('Missing required parameter /{engagementId}/.');
  }

  const decoded: JWTToken = jwt.verify(token, getEnvVariable(EnvVariable.SECRET_KEY)) as JWTToken;

  const userId = decoded.userId;

  const [checkResult] = await pool.query<RowDataPacket[]>(
    `
    SELECT 
      engagements.org_id AS orgId,
      engagements.name,
      engagements.is_invite_link_enabled AS isInviteLinkEnabled,
      engagements.invite_link_hash AS inviteLinkHash,
      orgs.owner_id AS orgOwnerId,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM engagement_users 
            WHERE engagement_id = 49 AND user_id = ?
        ) THEN 1 
        ELSE 0 
    END AS engagementUserExists
    FROM engagements
    LEFT JOIN orgs ON orgs.id = engagements.org_id
    WHERE engagements.id = ?
    `, [userId, engagementId]);

  if (!checkResult.length) {
    throw new NotFoundError(`Engagement with id ${engagementId} not found.`);
  }

  const {
    orgId,
    orgOwnerId,
    engagementUserExists,
  } = checkResult[0];

  if (orgOwnerId === userId || engagementUserExists) {
    req.userId = userId;
    req.orgId = orgId;
    req.engagement = {
      id: Number(engagementId),
      name: checkResult[0].name,
      inviteLinkHash: checkResult[0].inviteLinkHash,
      isInviteLinkEnabled: checkResult[0].isInviteLinkEnabled
    };
    return next();
  }

  throw new ForbiddenError(`You are not authorized to access engagement with id ${engagementId}.`);
};