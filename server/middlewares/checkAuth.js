const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.json({ message: 'Missing authentication token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const userId = decoded.user.id;

    if (userId) {
      req.userId = userId;
      req.userObject = decoded.user;
      return next();
    }

    return res.json({ message: 'Invalid token.' });
  } catch (error) {
    next(error);
  }
};