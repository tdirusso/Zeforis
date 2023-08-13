const jwt = require('jsonwebtoken');
const { pool } = require('../../database');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

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

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const userId = decoded.user.id;

    if (engagementId) {
      const [doesEngagementUserExistResult] = await pool.query(
        'SELECT 1 FROM engagement_users WHERE user_id = ? AND engagement_id = ? AND (role = "admin" OR role = "member")',
        [userId, engagementId]
      );

      if (doesEngagementUserExistResult.length) {
        req.userId = userId;
        return next();
      } else {
        return res.json({ message: 'Unauthorized.' });
      }
    }
  } catch (error) {
    next(error);
  }
};