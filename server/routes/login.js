const bcrypt = require('bcrypt');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (req, res) => {
  const {
    email,
    password
  } = req.body;

  if (!email || !password) {
    return res.json({
      message: 'Missing credentials, please try again.'
    });
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      if (!user.isVerified) {
        return res.json({ message: 'Please verify your email address.' });
      }
      
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        const token = jwt.sign(
          {
            user: {
              id: user._id
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
