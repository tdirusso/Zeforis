const User = require('../../models/user');

module.exports = async (req, res) => {

  const user = req.user;

  if (!user) {
    res.json({ message: 'No user.' });
  }

  try {

    const userData = await User.findById(user.id)
      .populate('adminOfClients')
      .populate('memberOfClients')
      .populate('memberOfAccounts');


    return res.json({
      batchData: {
        userData
      }
    });

  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};