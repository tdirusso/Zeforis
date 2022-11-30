const Link = require('../../models/link');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (req, res) => {
  const {
    name,
    url,
    type,
    isParent
  } = req.body;

  if (!name || !url) {
    return res.json({
      message: 'Missing name or URL for link.'
    });
  }

  try {

    const link = await Link.create({
      name,
      url,
      type,
      isParent
    });

    return res.json({
      link: link.toObject()
    });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};