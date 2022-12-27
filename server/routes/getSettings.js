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

    const [clientMemberData] = await pool.query(
      `
        SELECT
          user.id
          user.first_name,
          user.last_name

        
        * FROM client_users 
        LEFT JOIN users ON users.id = client_users.user_id
        WHERE client_id = ?
      `,
      [clientId]
    );

    const [accountMemberData] = await pool.query(
      `
        SELECT 
          users.first_name, 
          users.last_name,
          clients.id as client_id,
          clients.name as client_name,
          users.id as user_id 
        FROM client_users
        LEFT JOIN clients ON client_users.client_id = clients.id
        LEFT JOIN users ON client_users.user_id = users.id
        LEFT JOIN accounts ON accounts.id = clients.account_id
        WHERE clients.account_id = ?
      `,
      [accountId]
    );

    const settings = {
      client: {
        members: [],
        admins: []
      },
      account: {
        members: [],
        admins: []
      }
    };

    clientMemberData.forEach(row => {
      const {
        account_id,
        account_name,
        account_brand,
        account_logo,
        client_id,
        client_name,
        client_brand,
        client_logo,
        role
      } = row;

      const clientObject = {
        id: client_id,
        name: client_name,
        brandColor: client_brand,
        logo: client_logo,
        accountId: account_id
      };

      if (role === 'admin') {
        adminOfClients.push(clientObject);
      } else {
        memberOfClients.push(clientObject);
      }
    });

    return res.json({ settings });

  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message
    });
  }
};