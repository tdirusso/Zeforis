const { pool } = require('../../../database');

module.exports = async (req, res, next) => {
  const {
    engagementId,
    userId,
    isAdmin = false
  } = req.body;

  if (!userId || !engagementId) {
    return res.json({
      message: 'Missing permissions parameters.'
    });
  }

  try {
    const newRole = isAdmin ? 'admin' : 'member';

    await pool.query(
      'UPDATE engagement_users SET role = ? WHERE engagement_id = ? AND user_id = ?',
      [newRole, engagementId, userId]
    );

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};