const pool = require('../../database');

module.exports = async (req, res) => {
  const {
    taskId
  } = req.body;

  if (!taskId) {
    return res.json({
      message: 'Missing taskId.'
    });
  }

  try {
    await pool.query('DELETE FROM task_tags WHERE task_id = ?', [taskId]);
    await pool.query('DELETE FROM tasks WHERE id = ?', [taskId]);

    return res.json({ success: true });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};