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
      const [engagementMemberData] = await pool.query(
        `
          SELECT 
            engagement_users.engagement_id, 
            engagement_users.user_id,
            engagement_users.role,
            orgs.name AS org_name,
            orgs.brand_color AS org_brand,
            orgs.logo_url AS org_logo,
            orgs.id AS org_id,
            engagements.name AS engagement_name
          FROM engagement_users
          LEFT JOIN engagements ON engagements.id = engagement_users.engagement_id
          LEFT JOIN orgs ON orgs.id = engagements.org_id
          WHERE user_id = ?
          ORDER BY engagement_name
        `,
        [userId]
      );

      const [ownedOrgsData] = await pool.query(
        'SELECT id, name, brand_color, logo_url, owner_id FROM orgs WHERE owner_id = ? ORDER BY name',
        [userId]
      );

      const memberOfOrgs = {};
      const memberOfEngagements = [];
      const adminOfEngagements = [];

      ownedOrgsData.forEach(row => {
        memberOfOrgs[row.id] = {
          id: row.id,
          name: row.name,
          brandColor: row.brand_color,
          logo: row.logo_url
        };
      });

      engagementMemberData.forEach(row => {
        const {
          org_id,
          org_name,
          org_brand,
          org_logo,
          engagement_id,
          engagement_name,
          engagement_logo,
          role
        } = row;

        memberOfOrgs[org_id] = {
          id: org_id,
          name: org_name,
          brandColor: org_brand,
          logo: org_logo
        };

        const engagementObject = {
          id: engagement_id,
          name: engagement_name,
          logo: engagement_logo,
          orgId: org_id
        };

        if (role === 'admin') {
          adminOfEngagements.push(engagementObject);
        } else {
          memberOfEngagements.push(engagementObject);
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
          adminOfEngagements,
          memberOfEngagements
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