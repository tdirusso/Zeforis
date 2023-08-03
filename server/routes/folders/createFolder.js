const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    name,
    isKeyFolder,
    engagementId
  } = req.body;

  if (!name || !engagementId) {
    return res.json({
      message: 'Missing folder name or engagementId.'
    });
  }

  try {
    const newFolder = await pool.query(
      'INSERT INTO folders (name, engagement_id, is_key_folder) VALUES (?,?,?)',
      [name, engagementId, isKeyFolder]
    );

    const folderObject = {
      id: newFolder[0].insertId,
      name,
      engagement_id: engagementId,
      is_key_folder: isKeyFolder
    };

    return res.json({
      success: true,
      folder: folderObject
    });
  } catch (error) {
    console.log(error);

    return res.json({
      error: true,
      message: error.message
    });
  }
};