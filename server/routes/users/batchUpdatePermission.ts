import { RowDataPacket } from 'mysql2';
import { pool, commonQueries } from '../../database';
import { updateStripeSubscription } from '../../lib/utils';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    userId,
    isAdmin = false
  } = req.body;

  if (!userId) {
    return res.json({
      message: 'Missing permissions parameters.'
    });
  }

  const orgId = req.ownedOrg.id;
  const updaterUserId = req.userId;

  if (userId === updaterUserId) {
    return res.json({
      message: 'You cannot update your own permissions.'
    });
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const orgOwnerPlan = await commonQueries.getOrgOwnerPlan(connection, orgId);

    if (isAdmin && orgOwnerPlan === 'free') {
      return res.json({
        message: 'Cannot add more administrators.',
        uiProps: {
          alertType: 'upgrade'
        }
      });
    }

    const [allOrgEngagementsResult] = await connection.query<RowDataPacket[]>(
      'SELECT id FROM engagements WHERE org_id = ?',
      [orgId]
    );

    const newRole = isAdmin ? 'admin' : 'member';

    await connection.query(
      'UPDATE engagement_users SET role = ? WHERE engagement_id IN (?) AND user_id = ?',
      [newRole, allOrgEngagementsResult.map(({ id }) => id), userId]
    );

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