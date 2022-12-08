const bcrypt = require('bcrypt');
const User = require('../../models/user');

module.exports = async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    password,
    role,
    accountId
  } = req.body;

  if (!accountId) {
    return res.json({
      message: 'Missing accountId.'
    });
  }

  if (!email || !password) {
    return res.json({
      message: 'Missing email and/or password.'
    });
  }

  if (!firstName || !lastName) {
    return res.json({
      error: 'Missing first or last name.'
    });
  }

  try {
    const userExists = await User.exists({ email, accountId });

    if (userExists) {
      return res.json({
        error: `"${email}" is already in use.  Please login instead.`
      });
    }

    await User.create({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 10),
      role
    });

    return res.json({
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message
    });
  }
};