const jwt = require('jsonwebtoken');
const User = require('../../models/user');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (req, res) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.json({
      message: 'Unauthorized.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const userId = decoded.user.id;

    const user = await User.findById(userId).select('-password -jwtToken')
      .populate('adminOfClients')
      .populate('memberOfAccounts')
      .lean();

    return res.json({ user });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};