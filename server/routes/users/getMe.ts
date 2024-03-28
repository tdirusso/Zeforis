import { pool } from '../../database';
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { Engagement } from '../../../shared/types/Engagement';
import { BadRequestError } from '../../types/Errors';

export default async (req: Request, res: Response) => {
  const requestingUser = req.user;

  const userId = requestingUser.id;

  const [userDataResult] = await pool.query<RowDataPacket[]>('CALL getUserData(?)', [userId]);

  const [userPlanData, engagementMemberData, ownedOrgsData] = userDataResult;

  const userObect = { ...requestingUser, ...userPlanData[0] };

  const memberOfOrgs = new Map();
  const memberOfEngagements: Engagement[] = [];
  const adminOfEngagements: Engagement[] = [];

  ownedOrgsData.forEach((row: RowDataPacket) => {
    memberOfOrgs.set(row.id, {
      id: row.id,
      name: row.name,
      brandColor: row.brand_color,
      logo: row.logo_url,
      ownerId: row.owner_id
    });
  });

  engagementMemberData.forEach((row: RowDataPacket) => {
    const {
      org_id,
      org_name,
      org_brand,
      org_logo,
      org_owner,
      engagement_id,
      engagement_name,
      role
    } = row;

    memberOfOrgs.set(org_id, {
      id: org_id,
      name: org_name,
      brandColor: org_brand,
      logo: org_logo,
      ownerId: org_owner
    });

    const engagementObject = {
      id: engagement_id,
      name: engagement_name,
      orgId: org_id
    };

    if (role === 'admin') {
      adminOfEngagements.push(engagementObject);
    } else {
      memberOfEngagements.push(engagementObject);
    }
  });

  return res.json({
    ...userObect,
    orgs: [...memberOfOrgs.values()],
  });
};