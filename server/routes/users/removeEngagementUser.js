const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    userId,
    engagementId
  } = req.body;

  const updaterUserId = req.userId;

  if (updaterUserId === userId) {
    return res.json({ message: 'You cannot remove yourself.' });
  }

  if (!engagementId || !userId) {
    return res.json({
      message: 'Missing removal parameters.'
    });
  }

  try {
    await pool.query(
      'DELETE FROM engagement_users WHERE engagement_id = ? AND user_id = ?',
      [engagementId, userId]
    );

    return res.json({ success: true });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};