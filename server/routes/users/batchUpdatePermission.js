const { pool } = require('../../../database');
const { updateStripeSubscription } = require('../../../lib/utils');

module.exports = async (req, res, next) => {
  const {
    userId,
    isAdmin = false
  } = req.body;

  const { userObject } = req;

  if (isAdmin && userObject.plan === 'free') {
    return res.json({ message: 'Upgrade to Zeforis Pro to add administrators.' });
  }

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

  try {
    const [allOrgEngagementsResult] = await connection.query(
      'SELECT id FROM engagements WHERE org_id = ?',
      [orgId]
    );

    const newRole = isAdmin ? 'admin' : 'member';

    await connection.query(
      'UPDATE engagement_users SET role = ? WHERE engagement_id IN (?) AND user_id = ?',
      [newRole, allOrgEngagementsResult.map(({ id }) => id), userId]
    );

    if (isAdmin) {
      const { success, message } = await updateStripeSubscription(connection, userObject.id);
    }

    connection.release();

    return res.json({ success: true });
  } catch (error) {
    connection.release();
    next(error);
  }
};