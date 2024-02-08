const { pool, commonQueries } = require('../../database');
const { updateStripeSubscription } = require('../../lib/utils');

module.exports = async (req, res, next) => {
  const {
    isAdmin = false
  } = req.body;

  const {
    engagementId,
    userId
  } = req.params;

  const { userObject, ownedOrg } = req;

  if (isAdmin && userObject.plan === 'free') {
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

  if (userId === updaterUserId) {
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
      const { success, message } = await updateStripeSubscription(connection, userObject.id, ownedOrg.id);

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