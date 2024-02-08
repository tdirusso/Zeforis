const { pool } = require('../../database');

module.exports = async (req, res, next) => {
  const {
    widgetId,
    name,
    body,
    isEnabled,
    backgroundColor
  } = req.body;

  if (!name || !widgetId) {
    return res.json({
      message: 'Missing widget parameters.'
    });
  }

  try {
    await pool.query(
      `
        UPDATE widgets SET 
          name = ?,
          body = ?,
          is_enabled = ?,
          background_color = ?
        WHERE id = ?
      `,
      [name, body, isEnabled, backgroundColor, widgetId]
    );

    return res.json({
      success: true
    });
  } catch (error) {
    next(error);
  }
};