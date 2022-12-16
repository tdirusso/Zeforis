const bcrypt = require('bcrypt');
const User = require('../../models/user');
const validator = require("email-validator");

module.exports = async (req, res) => {
  const {
    email,
    password,
    clientId
  } = req.body;

  if (!clientId) {
    return res.json({ message: 'No clientId.' });
  }

  if (!email || !password) {
    return res.json({
      message: 'Missing email or password parameters.'
    });
  }

  if (!validator.validate(email)) {
    return res.json({ message: 'Email address is not valid.' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.json({
        message: 'User does not exist.'
      });
    }

    if (user.password) {
      return res.json({ message: 'Account already fully registered - please sign in instead.' });
    }

    const isUserAdminOfClient = user.memberOfAccounts.some(({ _id }) => _id.toString() === clientId);
    const isUserMemberOfClient = user.memberOfClients.some(({ _id }) => _id.toString() === clientId);

    if (isUserAdminOfClient || isUserMemberOfClient) {
      user.password = await bcrypt.hash(password, 10);
      user.isVerified = true;
      await user.save();

      return res.json({ success: true });
    } else {
      return res.json({ message: 'User is not a member or administrator of this client.' });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message
    });
  }
};