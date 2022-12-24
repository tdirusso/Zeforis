const pool = require('../../database');

const isDev = process.env.NODE_ENV === 'development';

module.exports = async (req, res) => {
  const {
    email,
    verificationCode
  } = req.query;

  if (!email || !verificationCode) {
    return res.json({
      message: 'Missing verification parameters.'
    });
  }

  try {
    const [result] = await pool.query(
      'UPDATE users SET verification_code = NULL, is_verified = 1 WHERE email = ? AND verification_code = ?',
      [email.toLowerCase(), verificationCode]
    );

    if (result.affectedRows) {
      return res.redirect(
        isDev ?
          'http://localhost:3000/login?postVerify=true' :
          'google.com'
      );
    }

    return res.json({
      message: 'User does not exist.'
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message
    });
  }
};