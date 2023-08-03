const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    tagId,
    engagementId
  } = req.body;

  if (!tagId || !engagementId) {
    return res.json({
      message: 'Missing tag removal parameters.'
    });
  }

  try {
    await pool.query('DELETE FROM tags WHERE id = ?', [tagId]);

    return res.json({ success: true });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};