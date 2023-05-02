const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    folderId
  } = req.body;

  if (!folderId) {
    return res.json({
      message: 'Missing folderId.'
    });
  }

  try {
    await pool.query('DELETE FROM folders WHERE id = ?', [folderId]);

    return res.json({ success: true });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};