const jwt = require('jsonwebtoken');
const { pool } = require('../../../database');
const { createJWT } = require('../../../lib/utils');

module.exports = async (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.json({
      message: 'Unauthorized.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const authenticatedUser = decoded.user;

    if (authenticatedUser) {
      const userId = authenticatedUser.id;

      const [userDataResult] = await pool.query('CALL getUserData(?)', [userId]);

      const [userPlanData, engagementMemberData, ownedOrgsData] = userDataResult;

      const userObect = { ...authenticatedUser, ...userPlanData[0] };

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

      return res.json({
        user: {
          ...userObect,
          memberOfOrgs: [...memberOfOrgs.values()],
          adminOfEngagements,
          memberOfEngagements
        },
        token: createJWT({ ...userObect })
      });
    }

    return res.json({ message: 'Unauthenticated.' });

  } catch (error) {
    next(error);
  }
};