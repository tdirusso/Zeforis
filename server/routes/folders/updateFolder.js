const { pool } = require('../../../database');

module.exports = async (req, res, next) => {
  const {
    name,
    isKeyFolder,
    folderId,
    parentId
  } = req.body;

  const { engagementId } = req;

  if (!name || !folderId) {
    return res.json({
      message: 'Missing folder parameters.'
    });
  }

  if (parentId && folderId === parentId) {
    return res.json({
      message: "Folder cannot be it's own parent."
    });
  }

  try {
    await pool.query(
      'UPDATE folders SET name = ?, is_key_folder = ?, parent_id = ? WHERE id = ?',
      [name, isKeyFolder, parentId, folderId]
    );

    const folderObject = {
      id: folderId,
      name,
      engagement_id: engagementId,
      is_key_folder: isKeyFolder,
      parent_id: parentId
    };

    return res.json({ updatedFolder: folderObject });
  } catch (error) {
    next(error);
  }
};