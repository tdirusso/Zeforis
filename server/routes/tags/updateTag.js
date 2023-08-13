const { pool } = require('../../../database');

module.exports = async (req, res, next) => {
  const {
    name,
    tagId
  } = req.body;

  if (!name || !tagId) {
    return res.json({
      message: 'Missing tag parameters.'
    });
  }

  try {
    await pool.query(
      'UPDATE tags SET name = ? WHERE id = ?',
      [name, tagId]
    );

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};