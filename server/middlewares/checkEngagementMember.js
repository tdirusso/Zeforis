const jwt = require('jsonwebtoken');
const { pool } = require('../../database');

module.exports = async (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.json({ message: 'Unauthorized.' });
  }

  let { engagementId } = req.body;

  if (!engagementId) {
    engagementId = req.query.engagementId;
  }

  if (!engagementId) {
    return res.json({ message: 'Unauthorized.' });
  }

  let { orgId } = req.body;

  if (!orgId) {
    orgId = req.query.orgId;
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const userId = decoded.user.id;

    if (engagementId) {
      const [doesEngagementUserExistResult] = await pool.query(
        'SELECT 1 FROM engagement_users WHERE user_id = ? AND engagement_id = ?',
        [userId, engagementId]
      );
            
      if (doesEngagementUserExistResult.length) {
        if (orgId) {
          const [orgIdForEngagementResult] = await pool.query(
            'SELECT org_id FROM engagements WHERE id = ?',
            [engagementId]
          );
      
          const orgIdForEngagement = orgIdForEngagementResult[0].org_id;
      
          if (orgIdForEngagement !== Number(orgId)) {
            return res.json({ message: 'Unauthorized' });
          }
        }

        req.userId = userId;
        req.userObject = decoded.user;
        req.engagementId = engagementId;
        req.orgId = orgId;
        return next();
      } else {
        return res.json({ message: 'Unauthorized.' });
      }
    }
  } catch (error) {
    next(error);
  }
};