const pool = require('../../database');

module.exports = async (req, res) => {
  const {
    userId,
    accountId
  } = req.body;

  if (!userId || !accountId) {
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
            SELECT id FROM folders WHERE client_id IN 
            (SELECT id FROM clients WHERE account_id = ?)
          )
      `,
      [userId, accountId]
    );

    await pool.query(
      `DELETE FROM client_users WHERE user_id = ? AND client_id IN (SELECT id FROM clients WHERE account_id = ?)`,
      [userId, accountId]
    );

    return res.json({ success: true });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};