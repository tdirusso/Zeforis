const { pool } = require('../../../database');

module.exports = async (req, res, next) => {
  const {
    userId,
    orgId
  } = req.body;

  if (!userId || !orgId) {
    return res.json({
      message: 'Missing user deletion parameters.'
    });
  }

  try {
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