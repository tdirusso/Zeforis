const jwt = require('jsonwebtoken');
const pool = require('../../../database');

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
            orgs.name AS org_name,
            orgs.brand_color AS org_brand,
            orgs.logo_url AS org_logo,
            orgs.id AS org_id,
            clients.name AS client_name
          FROM client_users
          LEFT JOIN clients ON clients.id = client_users.client_id
          LEFT JOIN orgs ON orgs.id = clients.org_id
          WHERE user_id = ?
        `,
        [userId]
      );

      const [ownedOrgsData] = await pool.query(
        'SELECT id, name, brand_color, logo_url, owner_id FROM orgs WHERE owner_id = ?',
        [userId]
      );

      const memberOfOrgs = {};
      const memberOfClients = [];
      const adminOfClients = [];

      ownedOrgsData.forEach(row => {
        memberOfOrgs[row.id] = {
          id: row.id,
          name: row.name,
          brandColor: row.brand_color,
          logo: row.logo_url
        };
      });

      clientMemberData.forEach(row => {
        const {
          org_id,
          org_name,
          org_brand,
          org_logo,
          client_id,
          client_name,
          client_logo,
          role
        } = row;

        memberOfOrgs[org_id] = {
          id: org_id,
          name: org_name,
          brandColor: org_brand,
          logo: org_logo
        };

        const clientObject = {
          id: client_id,
          name: client_name,
          logo: client_logo,
          orgId: org_id
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
          memberOfOrgs: Object.values(memberOfOrgs),
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