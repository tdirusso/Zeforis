const pool = require('../../database');

module.exports = async (req, res) => {
  const {
    name,
    description,
    clientId
  } = req.body;

  if (!name || !clientId) {
    return res.json({
      message: 'Missing folder name or clientId.'
    });
  }

  try {
    const newFolder = await pool.query(
      'INSERT INTO folders (name, description, client_id) VALUES (?,?,?)',
      [name, description, clientId]
    );

    const folderObject = {
      id: newFolder[0].insertId,
      name,
      description,
      clientId
    };

    return res.json({ folder: folderObject });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};