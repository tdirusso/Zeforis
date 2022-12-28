const pool = require('../../database');

module.exports = async (req, res) => {
  const {
    name,
    description = null,
    status = 'New',
    folderId,
    linkUrl = null,
    assignedToId = null,
    progress = 0
  } = req.body;

  const creatorUserId = req.userId;

  if (!name || !folderId || !creatorUserId) {
    return res.json({
      message: 'Missing task parameters.'
    });
  }

  try {

    const newTask = await pool.query(
      `INSERT INTO tasks 
        (name, description, status, folder_id, link_url, assigned_to_id, progress, created_by_id) 
        VALUES 
        (?,?,?,?,?,?,?,?)`,
      [name, description, status, folderId, linkUrl, assignedToId, progress, creatorUserId]
    );

    return res.json({
      success: true,
      id: newTask[0].insertId
    });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};