const Client = require('../../models/client');

module.exports = async (req, res) => {
  const {
    name,
    brandColor,
    clientId
  } = req.body;

  if (!clientId) {
    return res.json({
      message: 'No client ID supplied.'
    });
  }

  if (!name || !brandColor) {
    return res.json({
      error: 'Missing client name.'
    });
  }

  try {
    const client = await Client.findById(clientId);

    if (!client) {
      return res.json({
        message: 'This client does not exist.'
      });
    }

    client.name = name;
    client.brandColor = brandColor;

    await client.save();

    return res.json({
      client: client.toObject()
    });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};