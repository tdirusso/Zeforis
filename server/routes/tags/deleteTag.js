const { pool } = require('../../database');

module.exports = async (req, res, next) => {
  const {
    tagId
  } = req.body;

  if (!tagId) {
    return res.json({
      message: 'Missing tag removal parameters.'
    });
  }

  try {
    await pool.query('DELETE FROM tags WHERE id = ?', [tagId]);

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};