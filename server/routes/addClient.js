const pool = require('../../database');

module.exports = async (req, res) => {
  const {
    name,
    accountId
  } = req.body;

  const { userId } = req;

  if (!name) {
    return res.json({
      message: 'Missing client name.'
    });
  }

  try {
    const newClient = await pool.query(
      'INSERT INTO clients (name, account_id) VALUES (?,?)',
      [name, accountId]
    );

    const newClientId = newClient[0].insertId;

    await pool.query(
      'INSERT INTO client_users (client_id, user_id, role) VALUES (?,?, "admin")',
      [newClientId, userId]
    );

    const clientObject = {
      id: newClientId,
      name,
      accountId
    };

    return res.json({ client: clientObject });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};