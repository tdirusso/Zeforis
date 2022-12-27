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
      let removedFromAccount = false;

      const [countResult] = await pool.query(
        `
        SELECT COUNT(*) FROM 
          (
            SELECT 1 FROM client_users
            LEFT JOIN clients ON clients.id = client_users.client_id
            LEFT JOIN accounts ON accounts.id = clients.account_id 
            WHERE accounts.id = ? AND user_id = ?
          ) 
        AS count`,
        [accountId, userId]
      );

      const clientCount = Object.values(countResult[0])[0];

      if (clientCount === 0) {
        removedFromAccount = true;
      }

      return res.json({
        success: true,
        removedFromAccount
      });
    }

    return res.json({ message: 'User is not a member of this client' });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};