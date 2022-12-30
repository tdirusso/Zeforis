const pool = require('../../database');

module.exports = async (req, res) => {
  const {
    tagId,
    clientId
  } = req.body;

  if (!tagId || !clientId) {
    return res.json({
      message: 'Missing tag removal parameters.'
    });
  }

  try {

    await pool.query('DELETE FROM task_tags WHERE tag_id = ?', [tagId]);
    await pool.query('DELETE FROM tags WHERE id = ?', [tagId]);

    return res.json({ success: true });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};