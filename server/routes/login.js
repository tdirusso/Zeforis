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
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        var populateQuery = [
          {path:'adminOfClients'}, 
          {path:'memberOfClients'}
        ];

        // await user.populate('adminOfClients')
        //   .populate('memberOfClients')
        //   .populate('memberOfAccounts')
        //   .populate('ownerOfAccount')
        //   .lean();
        await User.populate(user, populateQuery);

        console.log(user);

        const token = jwt.sign(
          {
            user: {
              id: user._id,
              adminOfClients: user.adminOfClients,
              memberOfClients: user.memberOfClients,
              memberOfAccounts: user.memberOfAccounts,
              ownerOfAccount: user.ownerOfAccount
            }
          },
          process.env.SECRET_KEY,
          { expiresIn: 86400 }
        );

        user.jwtToken = token;
        await user.save();

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
