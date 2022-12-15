const User = require('../../models/user');
const Account = require('../../models/account');
const Client = require('../../models/client');

module.exports = async (req, res) => {
  const {
    userId,
    accountId,
    clientId
  } = req.body;

  const updaterUserId = req.userId;

  if (updaterUserId === userId) {
    return res.json({ message: 'You cannot remove yourself.' });
  }

  if (!clientId || !accountId || !userId) {
    return res.json({
      message: 'Missing removal parameters.'
    });
  }

  try {
    const user = await User.findOneAndUpdate({ _id: userId }, { $pull: { memberOfClients: clientId } }, { new: true });
    await Client.updateOne({ _id: clientId }, { $pull: { members: userId } });

    if (user.memberOfClients.length === 0 && user.adminOfClients.length === 0) {
      user.memberOfAccounts = [];
      await user.save();
      await Account.updateOne({ _id: accountId }, { $pull: { members: userId } });
    }

    return res.json({ success: true });

  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};