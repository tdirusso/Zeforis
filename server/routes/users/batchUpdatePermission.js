const { pool, commonQueries } = require('../../../database');
const { updateStripeSubscription } = require('../../../lib/utils');

module.exports = async (req, res, next) => {
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
      return res.json({ message: 'Upgrade to Zeforis Pro to add administrators.' });
    }

    const [allOrgEngagementsResult] = await connection.query(
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