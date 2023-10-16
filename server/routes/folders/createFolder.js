const { pool } = require('../../../database');

module.exports = async (req, res, next) => {
  const {
    name,
    isKeyFolder = false,
    parentId = null
  } = req.body;

  const { engagementId } = req;

  if (!name || !engagementId) {
    return res.json({
      message: 'Missing folder name or engagementId.'
    });
  }

  try {
    const newFolder = await pool.query(
      'INSERT INTO folders (name, engagement_id, is_key_folder, parent_id) VALUES (?,?,?,?)',
      [name, engagementId, isKeyFolder, parentId]
    );

    const folderObject = {
      id: newFolder[0].insertId,
      name,
      engagement_id: engagementId,
      is_key_folder: isKeyFolder,
      parent_id: parentId
    };

    return res.json({
      success: true,
      folder: folderObject
    });
  } catch (error) {
    next(error);
  }
};