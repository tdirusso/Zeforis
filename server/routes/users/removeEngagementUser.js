const { pool, commonQueries } = require('../../../database');
const { updateStripeSubscription } = require('../../../lib/utils');

module.exports = async (req, res, next) => {
  const {
    userId,
    engagementId
  } = req.body;

  const updaterUserId = req.userId;
  const orgId = req.ownedOrg.id;

  if (updaterUserId === userId) {
    return res.json({ message: 'You cannot remove yourself.' });
  }

  if (!engagementId || !userId) {
    return res.json({
      message: 'Missing removal parameters.'
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