const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    engagementId
  } = req.body;

  if (!engagementId) {
    return res.json({
      message: 'Missing engagementId.'
    });
  }

  try {
    await pool.query('DELETE FROM engagements WHERE id = ?', [engagementId]);

    return res.json({ success: true });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};