const pool = require('../../database');

module.exports = async (req, res) => {
  const {
    folderId
  } = req.body;

  if (!folderId) {
    return res.json({
      message: 'Missing taskId.'
    });
  }

  try {
    await pool.query('DELETE FROM task_tags WHERE task_id IN (SELECT id FROM tasks WHERE folder_id = ?)', [folderId]);
    await pool.query('DELETE FROM tasks WHERE folder_id = ?', [folderId]);
    await pool.query('DELETE FROM folders WHERE id = ?', [folderId]);

    return res.json({ success: true });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};