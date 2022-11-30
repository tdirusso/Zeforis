const bcrypt = require('bcrypt');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      error: 'Missing credentials, please try again.'
    });
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        const {
          role,
          firstName,
          lastName,
          email
        } = user;

        const token = jwt.sign(
          {
            user: {
              id: user._id,
              role,
              firstName,
              lastName,
              email
            }
          },
          process.env.SECRET_KEY,
          { expiresIn: 86400 }
        );

        user.jwtToken = token;
        await user.save();

        return res.json({
          token,
          role
        });
      }

      return res.json({
        message: 'The username or password are incorrect.  Please try again.'
      });
    }

    return res.json({
      message: `The username or password are incorrect.  Please try again.`
    });
  } catch (error) {
    console.log(error);
  }
};
