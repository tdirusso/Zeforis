const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    userId,
    clientId
  } = req.body;

  const updaterUserId = req.userId;

  if (updaterUserId === userId) {
    return res.json({ message: 'You cannot remove yourself.' });
  }

  if (!clientId || !userId) {
    return res.json({
      message: 'Missing removal parameters.'
    });
  }

  try {
    await pool.query(
      'DELETE FROM client_users WHERE client_id = ? AND user_id = ?',
      [clientId, userId]
    );

    return res.json({ success: true });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};