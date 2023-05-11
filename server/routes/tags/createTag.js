const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    name,
    clientId
  } = req.body;

  if (!clientId || !name) {
    return res.json({
      message: 'Missing tag parameters.'
    });
  }

  try {

    const newTag = await pool.query(
      'INSERT INTO tags (name, client_id) VALUES (?,?)',
      [name, clientId]
    );

    const newTagId = newTag[0].insertId;

    const tagObject = {
      name,
      id: newTagId,
      client_id: clientId
    };

    return res.json({
      success: true,
      tag: tagObject
    });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};