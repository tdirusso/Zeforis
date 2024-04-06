import { pool, commonQueries } from '../../database';
import { updateStripeSubscription } from '../../lib/utils';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    userId
  } = req.params;

  const userIdParam = Number(userId);

  const orgId = req.org.id;
  const updaterUserId = req.userId;

  if (!userIdParam || !orgId) {
    return res.json({
      message: 'Missing user deletion parameters.'
    });
  }

  if (updaterUserId === userIdParam) {
    return res.json({ message: 'You cannot remove yourself.' });
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
            SELECT id FROM folders WHERE engagement_id IN 
            (SELECT id FROM engagements WHERE org_id = ?)
          )
      `,
      [userId, orgId]
    );

    await connection.query(
      `DELETE FROM engagement_users WHERE user_id = ? AND engagement_id IN (SELECT id FROM engagements WHERE org_id = ?)`,
      [userId, orgId]
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