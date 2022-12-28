const jwt = require('jsonwebtoken');
const pool = require('../../database');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (req, res) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.json({
      message: 'Unauthorized.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const userId = decoded.user.id;

    const [userResult] = await pool.query(
      'SELECT id, first_name, last_name, email, date_created FROM users WHERE id = ?',
      [userId]
    );

    const user = userResult[0];

    if (user) {
      const [clientMemberData] = await pool.query(
        `
          SELECT 
            client_users.client_id, 
            client_users.user_id,
            client_users.role,
            accounts.name AS account_name,
            accounts.brand_color AS account_brand,
            accounts.logo_url AS account_logo,
            accounts.id AS account_id,
            clients.name AS client_name, 
            clients.brand_color AS client_brand, 
            clients.logo_url AS client_logo
          FROM client_users
          LEFT JOIN clients ON clients.id = client_users.client_id
          LEFT JOIN accounts ON accounts.id = clients.account_id
          WHERE user_id = ?
        `,
        [userId]
      );

      const [ownedAccountsData] = await pool.query(
        'SELECT id, name, brand_color, logo_url FROM accounts WHERE owner_id = ?',
        [userId]
      );

      const memberOfAccounts = {};
      const memberOfClients = [];
      const adminOfClients = [];

      ownedAccountsData.forEach(row => {
        memberOfAccounts[row.id] = {
          id: row.id,
          name: row.name,
          brandColor: row.brand_color,
          logo: row.logo_url
        };
      });

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

        memberOfAccounts[account_id] = {
          id: account_id,
          name: account_name,
          brandColor: account_brand,
          logo: account_logo
        };

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

      return res.json({
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          dateCreated: user.date_created,
          memberOfAccounts: Object.values(memberOfAccounts),
          adminOfClients,
          memberOfClients
        }
      });
    }

    return res.json({ message: 'User does not exist.' });

  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};