const jwt = require('jsonwebtoken');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (req, res, next) => {
  let { token } = req.body;

  if (!token) {
    token = req.headers['x-access-token'];

    if (!token) {
      return res.json({ message: 'Unauthorized.' });
    }
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.accountId = decoded.user.accountId;
    return next();

  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};