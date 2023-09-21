const { pool } = require('../../../database');

module.exports = async (req, res, next) => {
  const {
    orgId
  } = req.body;

  const { engagementId } = req;

  if (!engagementId || !orgId) {
    return res.json({
      message: 'Missing engagementId or orgId.'
    });
  }

  const userId = req.userId;

  try {
    const [isUserOwnerOfOrgResult] = await pool.query(
      'SELECT 1 FROM orgs WHERE id = ? AND owner_id = ?',
      [orgId, userId]
    );

    if (isUserOwnerOfOrgResult.length) {
      return res.json({
        message: 'As the org owner, you may only delete the engagement.'
      });
    }

    await pool.query(
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

    await pool.query('DELETE FROM engagement_users WHERE user_id = ? AND engagement_ID = ?', [userId, engagementId]);

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};