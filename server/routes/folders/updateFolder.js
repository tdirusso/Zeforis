const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    name,
    isKeyFolder,
    folderId,
    clientId
  } = req.body;

  if (!name || !folderId) {
    return res.json({
      message: 'Missing folder parameters.'
    });
  }

  try {
    await pool.query(
      'UPDATE folders SET name = ?, is_key_folder = ? WHERE id = ?',
      [name, isKeyFolder, folderId]
    );

    const folderObject = {
      id: folderId,
      name,
      client_id: clientId,
      is_key_folder: isKeyFolder
    };

    return res.json({ updatedFolder: folderObject });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};