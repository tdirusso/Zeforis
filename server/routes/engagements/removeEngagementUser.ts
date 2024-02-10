import { pool, commonQueries } from '../../database';
import { updateStripeSubscription } from '../../lib/utils';
import { Request, Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2';

export default async (req: Request, res: Response, next: NextFunction) => {
  const updaterUserId = req.userId;

  const {
    userId,
    engagementId
  } = req.params;

  const userIdParam = Number(userId);

  if (!userIdParam) {
    return res.json({ message: 'missing userId param' });
  }

  if (!req.ownedOrg?.id) {
    return res.json({ message: 'Missing ownedOrg' });
  }

  const orgId = req.ownedOrg.id;

  if (updaterUserId === userIdParam) {
    return res.json({ message: 'You cannot remove yourself.' });
  }

  if (!engagementId) {
    return res.json({
      message: 'Missing engagementId parameter.'
    });
  }

  const connection = await pool.getConnection();

  await connection.beginTransaction();

  try {

    await connection.query(
      `
        UPDATE tasks 
        SET assigned_to_id = NULL
        WHERE assigned_to_id = ? AND folder_id IN 
          (
            SELECT id FROM folders WHERE engagement_id = ?
          )
      `,
      [userId, engagementId]
    );

    await connection.query(
      'DELETE FROM engagement_users WHERE engagement_id = ? AND user_id = ?',
      [engagementId, userId]
    );

    const orgOwnerPlan = await commonQueries.getOrgOwnerPlan(connection, orgId);

    if (orgOwnerPlan !== 'free') {
      const { success, message } = await updateStripeSubscription(connection, updaterUserId, orgId);

      if (!success) {
        await connection.rollback();

        connection.release();
        return res.json({ message });
      }
    }

    await connection.commit();
    connection.release();

    return res.json({ success: true });
  } catch (error) {
    await connection.rollback();

    connection.release();
    next(error);
  }
};