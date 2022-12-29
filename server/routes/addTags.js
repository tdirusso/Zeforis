const pool = require('../../database');

module.exports = async (req, res) => {
  const {
    tags,
    clientId
  } = req.body;

  if (!tags || !clientId || tags.length === 0) {
    return res.json({
      message: 'Missing tag parameters.'
    });
  }

  try {

    const insertValues = tags.map(tag => [tag.trim(), clientId]);

    const newTags = await pool.query(
      'INSERT INTO tags (name, client_id) VALUES ?',
      [insertValues]
    );

    const firstNewId = newTags[0].insertId;

    const newTagsArray = insertValues.map((value, index) => ({
      name: value[0],
      id: firstNewId + index,
      clientId
    }));

    return res.json({ success: true, tags: newTagsArray });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};