const pool = require('../../database');

module.exports = async (req, res) => {
  const {
    userId,
    accountId,
    clientId
  } = req.body;

  const updaterUserId = req.userId;

  if (updaterUserId === userId) {
    return res.json({ message: 'You cannot remove yourself.' });
  }

  if (!clientId || !accountId || !userId) {
    return res.json({
      message: 'Missing removal parameters.'
    });
  }

  try {
    const [removeResult] = await pool.query(
      'DELETE FROM client_users WHERE client_id = ? AND user_id = ? AND role = "member"',
      [clientId, userId]
    );

    if (removeResult.affectedRows) {
      return res.json({ success: true });
    }

    return res.json({ message: 'User is not a member of this client' });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};