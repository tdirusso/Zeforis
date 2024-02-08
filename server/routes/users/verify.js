const { pool } = require('../../database');

module.exports = async (req, res, next) => {
  const {
    verificationCode
  } = req.query;

  const {
    userId
  } = req.params;

  if (isNaN(userId)) {
    return res.json({ message: `Invalid userId provided: ${userId} - must be a number.` });
  }

  if (!verificationCode) {
    return res.json({ message: 'Missing verificationCode.' });
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