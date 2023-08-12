const pool = require('../../../database');

module.exports = async (req, res, next) => {
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
    next(error);
  }
};