const jwt = require('jsonwebtoken');
const { pool } = require('../../../database');

module.exports = async (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.json({
      message: 'Unauthorized.'
    });
  }

  const {
    updateStaleUser
  } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const authenticatedUser = decoded.user;

    if (authenticatedUser) {
      const userId = authenticatedUser.id;

      let freshUserData = null;

      if (updateStaleUser) {
        const [userResult] = await pool.query(
          `
          SELECT 
            id,
            first_name AS firstName,
            last_name AS lastName,
            email,
            date_created AS dateCreated,
            plan,
            stripe_subscription_status AS subscriptionStatus
          FROM users
          WHERE id = ?`,
          [userId]
        );

        freshUserData = userResult[0];
      }

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
            orgs.owner_id AS org_owner,
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

      const memberOfOrgs = new Map();
      const memberOfEngagements = [];
      const adminOfEngagements = [];

      ownedOrgsData.forEach(row => {
        memberOfOrgs.set(row.id, {
          id: row.id,
          name: row.name,
          brandColor: row.brand_color,
          logo: row.logo_url,
          ownerId: row.owner_id
        });
      });

      engagementMemberData.forEach(row => {
        const {
          org_id,
          org_name,
          org_brand,
          org_logo,
          org_owner,
          engagement_id,
          engagement_name,
          role
        } = row;

        memberOfOrgs.set(org_id, {
          id: org_id,
          name: org_name,
          brandColor: org_brand,
          logo: org_logo,
          ownerId: org_owner
        });

        const engagementObject = {
          id: engagement_id,
          name: engagement_name,
          orgId: org_id
        };

        if (role === 'admin') {
          adminOfEngagements.push(engagementObject);
        } else {
          memberOfEngagements.push(engagementObject);
        }
      });

      const userData = freshUserData ? freshUserData : authenticatedUser;

      const newToken = jwt.sign(
        {
          user: {
            ...userData
          }
        },
        process.env.SECRET_KEY,
        { expiresIn: 3600 }
      );

      return res.json({
        user: {
          ...userData,
          memberOfOrgs: [...memberOfOrgs.values()],
          adminOfEngagements,
          memberOfEngagements
        },
        token: newToken
      });
    }

    return res.json({ message: 'Unauthenticated.' });

  } catch (error) {
    next(error);
  }
};