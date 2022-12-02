const Client = require('../../models/client');

module.exports = async (req, res) => {

  try {
    const clients = await Client.find({}).lean();

    return res.json({
      clients
    });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};