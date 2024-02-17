import { pool, commonQueries } from '../../database';
import { updateStripeSubscription } from '../../lib/utils';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    isAdmin = false
  } = req.body;

  const {
    engagementId,
    userId
  } = req.params;

  const userIdParam = Number(userId);

  const { user, ownedOrg } = req;

  if (isAdmin && user.plan === 'free') {
    return res.json({
      message: 'Cannot add more administrators.',
      uiProps: {
        alertType: 'upgrade'
      }
    });
  }

  if (!userId || !engagementId) {
    return res.json({
      message: 'Missing permissions parameters.'
    });
  }

  const updaterUserId = req.userId;

  if (userIdParam === updaterUserId) {
    return res.json({
      message: 'You cannot update your own permissions.'
    });
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const newRole = isAdmin ? 'admin' : 'member';

    await connection.query(
      'UPDATE engagement_users SET role = ? WHERE engagement_id = ? AND user_id = ?',
      [newRole, engagementId, userId]
    );

    const orgOwnerPlan = await commonQueries.getOrgOwnerPlan(connection, ownedOrg.id);

    if (orgOwnerPlan !== 'free') {
      const { success, message } = await updateStripeSubscription(connection, user.id, ownedOrg.id);

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