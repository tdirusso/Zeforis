const { pool } = require('../../../database');

module.exports = async (req, res, next) => {
  const {
    widgetId,
    name,
    title,
    body,
    isEnabled,
    backgroundColor,
    textColor
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
          title = ?,
          body = ?,
          is_enabled = ?,
          background_color = ?,
          text_color = ?
        WHERE id = ?
      `,
      [name, title, body, isEnabled, backgroundColor, textColor, widgetId]
    );

    return res.json({
      success: true
    });
  } catch (error) {
    next(error);
  }
};