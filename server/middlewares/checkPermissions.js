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
    const user = await User.findById(userId).lean();

    if (user) {
      req.user = user;

      if (user.needsUpdatedJWT) {
        await User.populate(user, [
          { path: 'adminOfClients', select: '_id name account' },
          { path: 'memberOfClients', select: '_id name account' },
          { path: 'memberOfAccounts', select: '_id name' },
          { path: 'ownerOfAccount', select: '_id name' }
        ]);

        const userTokenData = {
          user: {
            id: user._id,
            adminOfClients: user.adminOfClients,
            memberOfClients: user.memberOfClients,
            memberOfAccounts: user.memberOfAccounts,
            ownerOfAccount: user.ownerOfAccount
          }
        };

        const token = jwt.sign(userTokenData,
          process.env.SECRET_KEY,
          { expiresIn: 86400 }
        );

        user.needsUpdatedJWT = false;
        await user.save();

        return res.json({ updatedToken: token });
      }

      if (clientId) {
        const isAdminOfClient = user.adminOfClients.some(objectId => objectId.toString() === clientId);
        if (isAdminOfClient) {
          return next();
        } else {
          return res.json({ message: 'Unauthorized.' });
        }
      } else {
        const isOwnerOfAccount = user.ownerOfAccount._id === accountId;

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