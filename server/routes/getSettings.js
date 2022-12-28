const pool = require('../../database');

module.exports = async (req, res) => {
  const {
    accountId,
    clientId
  } = req.query;

  if (!accountId || !clientId) {
    return res.json({
      message: 'Missing settings parameters.'
    });
  }

  try {
    const [accountMemberData] = await pool.query(
      `
        SELECT 
          users.id as user_id,
          users.first_name, 
          users.last_name,
          users.email,
          clients.id as client_id,
          clients.name as client_name,
          client_users.role
        FROM client_users
        LEFT JOIN clients ON client_users.client_id = clients.id
        LEFT JOIN users ON client_users.user_id = users.id
        LEFT JOIN accounts ON accounts.id = clients.account_id
        WHERE clients.account_id = ?
      `,
      [accountId]
    );

    const users = {};

    accountMemberData.forEach(row => {
      const {
        client_id,
        client_name,
        user_id,
        first_name,
        last_name,
        role,
        email
      } = row;

      if (!users[user_id]) {
        users[user_id] = {
          firstName: first_name,
          lastName: last_name,
          email,
          id: user_id,
          memberOfClients: [],
          adminOfClients: []
        };
      }

      if (role === 'admin') {
        users[user_id].adminOfClients.push({
          id: client_id,
          name: client_name
        });
      } else {
        users[user_id].memberOfClients.push({
          id: client_id,
          name: client_name
        });
      }
    });

    const settings = {
      accountUsers: Object.values(users)
    };

    return res.json({ settings });

  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message
    });
  }
};