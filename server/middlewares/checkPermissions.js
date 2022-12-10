const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Account = require('../../models/account');

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

    req.userId = user._id;

    if (user) {
      if (clientId) {
        

      } else {
        const account = await Account.findById(accountId);

        if (!account) {
          return res.json({ message: 'Unknown account.' });
        } else if (user._id === account.createdBy.toString()) {
          return next();
        } else {
          return res.json({message: 'You are not the account owner.'})
        }
      }
     
     
     
      if (user.ownerOfAccount?.toString() === accountId) {
        return next();
      } else {
        const isAdminOfClient = user.adminOfClients.some(objectId => objectId.toString() === clientId);

        if (isAdminOfClient) {
          return next();
        } else {
          return res.json({ message: 'Unauthorized.' });
        }
      }
    }

    return res.json({ message: 'Invalid user.' });

  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};