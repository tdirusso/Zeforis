const pool = require('../../../database');

module.exports = async (req, res, next) => {
  const {
    engagementId,
    userId,
    hasAccess = false
  } = req.body;

  if (!userId || !engagementId) {
    return res.json({
      message: 'Missing permissions parameters.'
    });
  }

  try {
    if (hasAccess) {
      await pool.query('INSERT INTO engagement_users (engagement_id, user_id, role) VALUES (?,?,?)', [engagementId, userId, 'member']);
    } else {
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

      await pool.query('DELETE FROM engagement_users WHERE engagement_id = ? AND user_id = ?', [engagementId, userId]);
    }

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};