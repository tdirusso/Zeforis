const bcrypt = require('bcrypt');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (req, res) => {
  const {
    email,
    password,
    loginType
  } = req.body;

  if (!email || !password) {
    return res.json({
      message: 'Missing credentials, please try again.'
    });
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
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

        user.jwtToken = token;
        await user.save();

        if (loginType === 'admin') {
          if (user.adminOfClients.length === 0 && !user.ownerOfAccount) {
            return res.json({
              message: 'Your are not the owner or administrator for any accounts.  Please '
            });
          } else {
            return res.json({ token, redirectUrl: '/admin/dashboard' });
          }
        }

        return res.json({ token, redirectUrl: '/home/dashboard' });
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
