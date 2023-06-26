const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    clientId,
    name,
    title = '',
    body = '',
    isEnabled = 0,
    backgroundColor = '#ffffff',
    textColor = '#000000'
  } = req.body;

  if (!clientId) {
    return res.json({
      message: 'Missing clientId.'
    });
  }

  if (!name) {
    return res.json({
      message: 'Missing widget name.'
    });
  }

  try {
    const newWidget = await pool.query(
      `INSERT INTO widgets 
        (
          client_id,
          name,
          title,
          body, 
          is_enabled, 
          background_color,
          text_color
        ) 
        VALUES
        (?,?,?,?,?,?,?)`,
      [clientId, name, title, body, isEnabled, backgroundColor, textColor]
    );

    const newWidgetId = newWidget[0].insertId;

    const widgetObject = {
      id: newWidgetId,
      clientId,
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
    console.log(error);

    return res.json({
      error: true,
      message: error.message
    });
  }
};