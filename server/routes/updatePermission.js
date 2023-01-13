const pool = require('../../database');

module.exports = async (req, res) => {
  const {
    clientId,
    userId,
    isAdmin = false
  } = req.body;

  if (!userId || !clientId) {
    return res.json({
      message: 'Missing permissions parameters.'
    });
  }

  try {
    const newRole = isAdmin ? 'admin' : 'member';

    await pool.query(
      'UPDATE client_users SET role = ? WHERE client_id = ? AND user_id = ?',
      [newRole, clientId, userId]
    );

    return res.json({ success: true });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};