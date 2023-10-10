const cache = require('../../../cache');

module.exports = async (req, res, next) => {
  const {
    apiKey
  } = req.query;

  if (!apiKey || apiKey !== process.env.SECRET_KEY) {
    return res.json({
      message: 'Invalid API key.'
    });
  }

  cache.clear();

  return res.json({
    success: true
  });
};