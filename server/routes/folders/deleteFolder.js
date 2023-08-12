const pool = require('../../../database');

module.exports = async (req, res, next) => {
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
    next(error);
  }
};