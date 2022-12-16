const User = require('../../models/user');

module.exports = async (req, res) => {
  const {
    firstName,
    lastName
  } = req.body;

  const updaterUserId = req.userId;

  if (!firstName || !lastName) {
    return res.json({
      message: 'Missing first and last name.'
    });
  }

  if (!updaterUserId) {
    return res.json({ message: 'Missing user.' });
  }

  try {
    const user = await User.findByIdAndUpdate(updaterUserId, { firstName, lastName });

    if (!user) {
      return res.json({ message: 'User does not exist.' });
    }

    return res.json({ success: true });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};