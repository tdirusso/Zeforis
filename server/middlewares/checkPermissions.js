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

  let { clientId, accountId } = req.body;

  if (!clientId && !accountId) {
    ({ clientId, accountId } = req.query);

    if (!clientId && !accountId) {
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
      const [isOwnerOfAccountResult] = await pool.query(
        'SELECT 1 FROM accounts WHERE id = ? AND owner_id = ?',
        [accountId, userId]
      );

      if (isOwnerOfAccountResult.length) {
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