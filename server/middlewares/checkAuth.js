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

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const userId = decoded.user.id;
    const [existsResult] = await pool.query('SELECT EXISTS(SELECT 1 FROM users WHERE id = ?)', [userId]);

    if (Object.values(existsResult[0])[0]) {
      req.userId = userId;
      return next();
    }

    return res.json({ message: 'User does not exist.' });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};