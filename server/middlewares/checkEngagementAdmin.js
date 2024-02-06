const jwt = require('jsonwebtoken');
const { pool } = require('../../database');

module.exports = async (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.json({ message: 'Missing authentication token.' });
  }

  let { engagementId } = req.body;

  if (!engagementId) {
    engagementId = req.query.engagementId;
  }

  if (!engagementId) {
    return res.json({ message: 'No engagementId provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const userId = decoded.user.id;

    if (engagementId) {
      const [doesEngagementAdminExistResult] = await pool.query(
        'SELECT 1 FROM engagement_users WHERE user_id = ? AND engagement_id = ? AND role = "admin"',
        [userId, engagementId]
      );

      const [orgIdForEngagementResult] = await pool.query(
        'SELECT org_id FROM engagements WHERE id = ?',
        [engagementId]
      );

      const orgIdForEngagement = orgIdForEngagementResult[0].org_id;

      if (doesEngagementAdminExistResult.length) {
        req.userId = userId;
        req.userObject = decoded.user;
        req.engagementId = engagementId;
        req.orgId = orgIdForEngagement;

        return next();
      } else {
        return res.json({ message: 'Only administrators in this engagement can perform this operation.' });
      }
    }
  } catch (error) {
    next(error);
  }
};