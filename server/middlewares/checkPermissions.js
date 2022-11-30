const jwt = require('jsonwebtoken');
const User = require('../../models/user');

module.exports = async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return res.json({ message: 'Unauthorized.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const userId = decoded.user.id;
    const user = User.findById(userId);

    if (user.role === 'Administrator') {
      req.userId = userId;
      return next();
    }

    return res.json({ message: 'Invalid permissions.' });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};