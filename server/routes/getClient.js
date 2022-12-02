const Client = require('../../models/client');

module.exports = async (req, res) => {

  const { clientId } = req.query;

  if (!clientId) {
    return res.json({
      message: 'No clientId provided.'
    });
  }

  try {
    const client = await Client.findById(clientId)
      .lean()
      .populate('folders');

    if (client) {
      return res.json({ client });
    }

    return res.json({
      message: `Client not found with clientId ${clientId}`
    });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};