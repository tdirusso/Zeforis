const Folder = require('../../models/folder');

module.exports = async (req, res) => {
  const {
    name,
    parentFolderId,
    clientId
  } = req.body;

  if (!name || !clientId) {
    return res.json({
      message: 'Missing folder name or client ID.'
    });
  }

  try {

    const folder = await Folder.create({
      name,
      parentFolderId,
      clientId
    });

    return res.json({
      folder: folder.toObject()
    });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};