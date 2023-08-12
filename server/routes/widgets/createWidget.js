const pool = require('../../../database');

module.exports = async (req, res, next) => {
  const {
    engagementId,
    name,
    title = '',
    body = '',
    isEnabled = 0,
    backgroundColor = '#ffffff',
    textColor = '#000000'
  } = req.body;

  if (!name) {
    return res.json({
      message: 'Missing widget name.'
    });
  }

  try {
    const newWidget = await pool.query(
      `INSERT INTO widgets 
        (
          engagement_id,
          name,
          title,
          body, 
          is_enabled, 
          background_color,
          text_color
        ) 
        VALUES
        (?,?,?,?,?,?,?)`,
      [engagementId, name, title, body, isEnabled, backgroundColor, textColor]
    );

    const newWidgetId = newWidget[0].insertId;

    const widgetObject = {
      id: newWidgetId,
      engagementId,
      name,
      title,
      body,
      isEnabled,
      backgroundColor,
      textColor
    };

    return res.json({
      success: true,
      widget: widgetObject
    });
  } catch (error) {
    next(error);
  }
};