const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../../database');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (req, res) => {
  const {
    email,
    password
  } = req.body;

  if (!email || !password || email !== 'timgdirusso@gmail.com') {
    return res.json({
      message: 'Missing credentials, please try again.'
    });
  }

  try {

    const [userResult] = await pool.query(
      'SELECT id, is_verified, password FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    const user = userResult[0];

    if (user) {
      if (!user.is_verified) {
        return res.json({ message: 'Please verify your email address.' });
      }

      const match = await bcrypt.compare(password, user.password);

      if (match) {
        const token = jwt.sign(
          {
            user: {
              id: user.id
            }
          },
          process.env.SECRET_KEY,
          { expiresIn: 86400 }
        );

        return res.json({ token });
      }

      return res.json({
        message: 'Incorrect username or password.  Please try again.'
      });
    }

    return res.json({
      message: `Incorrect username or password.  Please try again.`
    });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};
