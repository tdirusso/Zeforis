const { pool } = require('../../../database');

module.exports = async (req, res, next) => {
  const {
    name,
    isKeyFolder,
    folderId,
    engagementId
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
      engagement_id: engagementId,
      is_key_folder: isKeyFolder
    };

    return res.json({ updatedFolder: folderObject });
  } catch (error) {
    next(error);
  }
};