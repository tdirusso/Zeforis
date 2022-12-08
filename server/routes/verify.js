const User = require('../../models/user');

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
    const user = await User.findOne({ email });

    if (user) {
      const storedCode = user.verificationCode;

      if (storedCode === verificationCode) {
        user.isVerified = true;
        user.verificationCode = undefined;

        await user.save();

        return res.redirect(
          isDev ?
            'http://localhost:3000/login?postVerify=true' :
            'google.com'
        );
      } else {
        return res.json({
          message: 'Invalid verification code, please try again.'
        });
      }
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