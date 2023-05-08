const pool = require('../../../database');

module.exports = async (req, res) => {
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
    console.log(error);

    return res.json({
      error: true,
      message: error.message
    });
  }
};