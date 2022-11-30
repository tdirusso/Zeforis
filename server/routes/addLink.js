const User = require('../../models/user');
const Link = require('../../models/link');
const jwt = require('jsonwebtoken');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (req, res) => {
  const {
    name,
    url,
    type,
    isParent,
    token
  } = req.body;

  if (!token) {
    return res.json({
      message: 'Unauthorized.'
    });
  }

  if (!name || !url) {
    return res.json({
      message: 'Missing name or URL for link.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.user.id;

    const user = await User.findById(userId);

    if (user.role === 'Administrator') {
      const link = await Link.create({
        name,
        url,
        type,
        isParent
      });

      return res.json({
        link: link.toObject()
      });
    }

    return res.json({
      message: 'You do not have the correct permissions.'
    })

  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};