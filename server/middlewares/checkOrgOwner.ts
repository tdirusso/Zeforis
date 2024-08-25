import jwt from 'jsonwebtoken';
import { pool } from '../database';
import { Request, Response, NextFunction } from 'express';
import { EnvVariable, getEnvVariable } from '../types/EnvVariable';
import { JWTToken } from '../types/Token';
import { RowDataPacket } from 'mysql2';
import { getAuthToken, getRequestParameter } from '../lib/utils';
import { BadRequestError, ErrorMessages, ForbiddenError, UnauthorizedError } from '../types/Errors';

export default async (req: Request, _: Response, next: NextFunction) => {
  const token = getAuthToken(req);

  if (!token) {
    throw new UnauthorizedError(ErrorMessages.NoTokenProvided);
  }

  const orgId = getRequestParameter('orgId', req);
  const engagementId = getRequestParameter('engagementId', req);

  if (!orgId && !engagementId) {
    throw new BadRequestError('Missing required parameter [engagementId] or [orgId].');
  }

  const decoded: JWTToken = jwt.verify(token, getEnvVariable(EnvVariable.SECRET_KEY)) as JWTToken;

  const userId = decoded.userId;

  if (userId) {
    let ownerOfOrgResult;

    if (engagementId) {
      [ownerOfOrgResult] = await pool.query<RowDataPacket[]>(
        `SELECT 
            orgs.id, 
            orgs.name, 
            orgs.brand_color AS brandColor,
            orgs.logo_url AS logo,
            engagements.name AS engagementName,
            engagements.is_invite_link_enabled AS isInviteLinkEnabled,
            engagements.invite_link_hash AS inviteLinkHash,
            engagements.allowed_invite_domains AS allowedInviteDomains
           FROM orgs
           LEFT JOIN engagements ON orgs.id = engagements.org_id
           WHERE engagements.id = ?
           AND orgs.owner_id = ?`,
        [engagementId, userId]
      );
    } else {
      [ownerOfOrgResult] = await pool.query<RowDataPacket[]>(
        'SELECT id, name, brand_color AS brandColor, logo_url AS logo FROM orgs WHERE id = ? AND owner_id = ?',
        [orgId, userId]
      );
    }

    if (ownerOfOrgResult.length) {
      req.userId = userId;
      req.org = {
        id: ownerOfOrgResult[0].id,
        name: ownerOfOrgResult[0].name,
        brandColor: ownerOfOrgResult[0].brandColor,
        logo: ownerOfOrgResult[0].logo
      };

      if (engagementId) {
        req.engagement = {
          id: Number(engagementId),
          name: ownerOfOrgResult[0].engagementName,
          isInviteLinkEnabled: ownerOfOrgResult[0].isInviteLinkEnabled,
          inviteLinkHash: ownerOfOrgResult[0].inviteLinkHash
        };
      }

      return next();
    } else {
      throw new ForbiddenError(`Forbidden request.  Only the org owner can perform this operation.`);
    }
  }

  throw new BadRequestError(ErrorMessages.InvalidTokenBody);
};