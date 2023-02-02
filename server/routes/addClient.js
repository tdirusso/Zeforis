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

  const connection = await pool.getConnection();

  try {
    const newClient = await connection.query(
      'INSERT INTO clients (name, account_id) VALUES (?,?)',
      [name, accountId]
    );

    const newClientId = newClient[0].insertId;

    await connection.query(
      'INSERT INTO client_users (client_id, user_id, role) VALUES (?,?, "admin")',
      [newClientId, userId]
    );

    const clientObject = {
      id: newClientId,
      name,
      accountId
    };

    connection.release();

    return res.json({ client: clientObject });
  } catch (error) {
    console.log(error);
    connection.release();

    return res.json({
      message: error.message
    });
  }
};