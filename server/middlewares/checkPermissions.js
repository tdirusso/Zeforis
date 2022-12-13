const jwt = require('jsonwebtoken');
const User = require('../../models/user');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.json({ message: 'Unauthorized.' });
  }

  const { clientId, accountId } = req.body;

  if (!clientId && !accountId) {
    return res.json({ message: 'Unauthorized.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const userId = decoded.user.id;
    const user = await User.findById(userId)
      .populate('ownerOfAccount')
      .populate('adminOfClients')
      .lean();

    if (user) {
      req.userId = user._id;

      if (clientId) {
        const isAdminOfClient = user.adminOfClients.some(objectId => objectId.toString() === clientId);

        if (isAdminOfClient) {
          return next();
        } else {
          return res.json({ message: 'Unauthorized.' });
        }
      } else {
        const isOwnerOfAccount = user.ownerOfAccount._id.toString() === accountId;

        if (isOwnerOfAccount) {
          return next();
        } else {
          return res.json({ message: 'Unauthorized' });
        }
      }
    }

    return res.json({ message: 'Unknown user.' });

  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};