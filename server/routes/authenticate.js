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
      const [userData] = await pool.query(
        `
          SELECT 
            client_admins.client_id, 
            client_admins.user_id,
            accounts.name AS account_name,
            accounts.brand_color AS account_brand,
            accounts.logo_url AS account_logo,
            accounts.id AS account_id,
            clients.name AS client_name, 
            clients.brand_color AS client_brand, 
            clients.logo_url AS client_logo, 
            'admin' AS permission_type FROM client_admins 
          LEFT JOIN clients ON clients.id = client_admins.client_id
          LEFT JOIN accounts ON accounts.id = clients.account_id
          WHERE user_id = ?
          UNION ALL
          SELECT 
            client_members.client_id, 
            client_members.user_id,
            accounts.name AS account_name,
            accounts.brand_color AS account_brand,
            accounts.logo_url AS account_logo,
            accounts.id AS account_id,
            clients.name AS client_name, 
            clients.brand_color AS client_brand, 
            clients.logo_url AS client_logo,
            'member' AS permission_type FROM client_members
          LEFT JOIN clients ON clients.id = client_members.client_id
          LEFT JOIN accounts ON accounts.id = clients.account_id
          WHERE user_id = ?
        `,
        [userId, userId]
      );

      const memberOfAccounts = {};
      const memberOfClients = [];
      const adminOfClients = [];

      userData.forEach(row => {
        const {
          account_id,
          account_name,
          account_brand,
          account_logo,
          client_id,
          client_name,
          client_brand,
          client_logo,
          permission_type
        } = row;

        memberOfAccounts[account_id] = {
          id: account_id,
          name: account_name,
          brand: account_brand,
          logo: account_logo
        };

        const clientObject = {
          id: client_id,
          name: client_name,
          brand: client_brand,
          logo: client_logo,
          accountId: account_id
        };

        if (permission_type === 'admin') {
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
          dateCreated: user.dateCreated,
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