const jwt = require('jsonwebtoken');
const pool = require('../../database');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.json({ message: 'Unauthorized.' });
  }

  let { clientId, orgId } = req.body;

  if (!clientId && !orgId) {
    ({ clientId, orgId } = req.query);

    if (!clientId && !orgId) {
      return res.json({ message: 'Unauthorized.' });
    }
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const userId = decoded.user.id;

    if (clientId) {
      const [doesClientAdminExistResult] = await pool.query(
        'SELECT 1 FROM client_users WHERE user_id = ? AND client_id = ? AND role = "admin"',
        [userId, clientId]
      );

      if (doesClientAdminExistResult.length) {
        req.userId = userId;
        return next();
      } else {
        return res.json({ message: 'Unauthorized.' });
      }
    } else {
      const [isOwnerOfOrgResult] = await pool.query(
        'SELECT 1 FROM orgs WHERE id = ? AND owner_id = ?',
        [orgId, userId]
      );

      if (isOwnerOfOrgResult.length) {
        req.userId = userId;
        return next();
      } else {
        return res.json({ message: 'Unauthorized' });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};