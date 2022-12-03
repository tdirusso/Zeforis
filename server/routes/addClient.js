const Client = require('../../models/client');
const Folder = require('../../models/folder');

module.exports = async (req, res) => {
  const {
    name,
    brandColor
  } = req.body;

  if (!name) {
    return res.json({
      error: 'Missing client name.'
    });
  }

  try {
    const client = await Client.create({
      name,
      brandColor
    });

    await Folder.create({
      name: 'root',
      clientId: client._id.toString(),
    });

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