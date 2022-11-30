const jwt = require('jsonwebtoken');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.json({
      message: 'No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    return res.json({
      user: decoded.user
    });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};