const User = require('../../models/user');
const Account = require('../../models/account');
const Client = require('../../models/client');

module.exports = async (req, res) => {
  const {
    accountId,
    clientId
  } = req.query;

  if (!accountId || !clientId) {
    return res.json({
      message: 'Missing settings parameters.'
    });
  }

  try {
    const client = await Client.findById(clientId).populate([
      { path: 'members' },
      { path: 'admins' }
    ]).lean();

    const account = await Account.findById(accountId).populate([
      { path: 'members' },
      { path: 'admins' }
    ]).lean();

    return res.json({ settings: { client, account } });

  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message
    });
  }
};