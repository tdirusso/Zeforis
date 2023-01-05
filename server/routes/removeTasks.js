const pool = require('../../database');

module.exports = async (req, res) => {
  const {
    taskIds
  } = req.body;

  if (!taskIds || taskIds.length === 0) {
    return res.json({
      message: 'Missing taskId.'
    });
  }

  try {
    await pool.query('DELETE FROM task_tags WHERE task_id IN (?)', [taskIds]);
    await pool.query('DELETE FROM tasks WHERE id IN (?)', [taskIds]);

    return res.json({ success: true });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};