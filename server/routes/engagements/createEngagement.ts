import { pool } from '../../database';
import { Request, Response, NextFunction } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    name
  } = req.body;

  const { userId, user } = req;

  const orgId = req.ownedOrg?.id;

  if (!name) {
    return res.json({
      message: 'Missing engagement name.'
    });
  }

  if (!orgId) {
    return res.json({
      message: 'Missing orgId.'
    });
  }

  if (!user) {
    return res.json({
      message: 'Missing user.'
    });
  }

  const connection = await pool.getConnection();

  try {

    if (user.plan === 'free') {
      const [engagementCountResult] = await connection.query<RowDataPacket[]>(
        'SELECT EXISTS(SELECT id FROM engagements WHERE org_id = ?) as engagementExists',
        [orgId]
      );

      if (engagementCountResult[0].engagementExists) {
        return res.json({ message: 'Upgrade to Zeforis Pro to create multiple engagements.' });
      }
    }

    const newEngagement = await connection.query<ResultSetHeader>(
      'INSERT INTO engagements (name, org_id) VALUES (?,?)',
      [name, orgId]
    );

    const newEngagementId = newEngagement[0].insertId;

    await connection.query(
      'INSERT INTO engagement_users (engagement_id, user_id, role) VALUES (?,?, "admin")',
      [newEngagementId, userId]
    );

    const engagementObject = {
      id: newEngagementId,
      name,
      orgId
    };

    connection.release();

    return res.json({ engagement: engagementObject });
  } catch (error) {
    connection.release();
    next(error);
  }
};