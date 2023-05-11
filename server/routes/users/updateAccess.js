const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    clientId,
    userId,
    hasAccess = false
  } = req.body;

  if (!userId || !clientId) {
    return res.json({
      message: 'Missing permissions parameters.'
    });
  }

  try {

    if (hasAccess) {
      await pool.query('INSERT INTO client_users (client_id, user_id, role) VALUES (?,?,?)', [clientId, userId, 'member']);
    } else {
      await pool.query(
        `
          UPDATE tasks 
          SET assigned_to_id = NULL
          WHERE assigned_to_id = ? AND folder_id IN 
            (
              SELECT id FROM folders WHERE client_id = ?
            )
        `,
        [userId, clientId]
      );

      await pool.query('DELETE FROM client_users WHERE client_id = ? AND user_id = ?', [clientId, userId]);
    }

    return res.json({ success: true });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};