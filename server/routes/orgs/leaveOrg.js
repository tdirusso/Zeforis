const pool = require('../../../database');

module.exports = async (req, res, next) => {
  const {
    orgId
  } = req.body;

  if (!orgId) {
    return res.json({
      message: 'Missing orgId.'
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
        message: 'As the org owner, you may only delete the organization.'
      });
    }

    await pool.query(
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

    await pool.query(
      `DELETE FROM engagement_users WHERE user_id = ? AND engagement_id IN (SELECT id FROM engagements WHERE org_id = ?)`,
      [userId, orgId]
    );

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};