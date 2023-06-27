const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    widgetId
  } = req.body;

  if (!widgetId) {
    return res.json({
      message: 'Missing widgetId.'
    });
  }

  try {
    await pool.query('DELETE FROM widgets WHERE id = ?', [widgetId]);

    return res.json({ success: true });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};