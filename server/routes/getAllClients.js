const Client = require('../../models/client');

module.exports = async (req, res) => {

  try {
    const clients = await Client.find({}).lean();

    clients.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

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