import { pool } from '../../database';
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { User } from '../../../shared/types/User';
import { Org } from '../../../shared/types/Org';

export default async (req: Request, res: Response<User>) => {
  const requestingUser = req.user;

  const userId = requestingUser.id;

  const [userDataResult] = await pool.query<[RowDataPacket[], Org[] & RowDataPacket[]]>('CALL getUserData(?)', [userId]);

  const [planData, orgData] = userDataResult;

  const userObect: User = { ...requestingUser, ...planData };

  return res.json({
    ...userObect,
    orgs: orgData,
  });
};



/*
  SELECT 
  engagement_users.engagement_id, 
  engagement_users.user_id,
  engagement_users.role,
  orgs.name AS org_name,
  orgs.brand_color AS org_brand,
  orgs.logo_url AS org_logo,
  orgs.id AS org_id,
  orgs.owner_id AS org_owner,
  engagements.name AS engagement_name
  FROM engagement_users
  LEFT JOIN engagements ON engagements.id = engagement_users.engagement_id
  LEFT JOIN orgs ON orgs.id = engagements.org_id
  WHERE user_id = userIdParam
  ORDER BY engagement_name;
*/