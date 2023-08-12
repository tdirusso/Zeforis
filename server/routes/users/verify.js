const pool = require('../../../database');

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (req, res, next) => {
  const {
    userId,
    verificationCode
  } = req.query;

  if (!userId || !verificationCode) {
    return res.json({
      message: 'Missing verification parameters.'
    });
  }

  try {
    const [result] = await pool.query(
      'UPDATE users SET verification_code = NULL, is_verified = 1 WHERE id = ? AND verification_code = ?',
      [userId, verificationCode]
    );

    if (result.affectedRows) {
      return res.redirect(`${process.env.APP_DOMAIN}/login?postVerify=true`);
    }

    return res.json({
      message: 'User does not exist.'
    });
  } catch (error) {
    next(error);
  }
};