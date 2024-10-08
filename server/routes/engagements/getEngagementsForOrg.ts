import { pool } from '../../database';
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { Engagement } from '../../../shared/types/Engagement';
import { BadRequestError, NotFoundError } from '../../types/Errors';
import type { GetEngagementsForOrgRequest } from '../../../shared/types/Engagement';

export default async (req: Request<GetEngagementsForOrgRequest, {}, {}>, res: Response<Engagement[]>) => {

  const {
    orgId
  } = req.params;

  const requestingUserId = req.userId;

  if (!orgId) {
    throw new BadRequestError('Missing required parameter [orgId].');
  }

  const connection = await pool.getConnection();

  const [orgResult] = await connection.query<RowDataPacket[]>('SELECT owner_id FROM orgs WHERE id = ?', [orgId]);

  if (!orgResult.length) {
    throw new NotFoundError(`Org with ID ${orgId} was not found.`);
  }

  const org = orgResult[0];

  if (org.owner_id === requestingUserId) {
    const [engagementsResult] = await connection.query<Engagement[] & RowDataPacket[]>(
      `SELECT 
      id,
      name, 
      org_id AS orgId, 
      date_created AS dateCreated,
      is_invite_link_enabled AS isInviteLinkEnabled,
      invite_link_hash AS inviteLinkHash,
      allowed_invite_domains AS allowedInviteDomains
      FROM engagements WHERE org_id = ? 
      ORDER BY name`,
      [orgId]);

    const engagements: Engagement[] = engagementsResult.map((engagement) => {
      return { ...engagement, role: 'admin' } as Engagement;
    });

    connection.release();

    return res.json(engagements);
  } else {
    const [engagementsResult] = await connection.query<Engagement[] & RowDataPacket[]>(
      `SELECT 
        id, 
        name,
        org_id as orgId, 
        date_created as dateCreated,
        engagement_users.role,
        is_invite_link_enabled AS isInviteLinkEnabled,
        invite_link_hash AS inviteLinkHash,
        allowed_invite_domains AS allowedInviteDomains
      FROM engagements 
      LEFT JOIN engagement_users ON engagements.id = engagement_users.engagement_id
      WHERE org_id = ? AND engagement_users.user_id = ?
      ORDER BY name`,
      [orgId, requestingUserId]);

    connection.release();

    return res.json(engagementsResult);
  }
};