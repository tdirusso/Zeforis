const pool = require('../../database');

module.exports = async (req, res) => {
  const {
    name,
    userId
  } = req.body;

  if (!name) {
    return res.json({
      message: 'Missing organization name.'
    });
  }

  try {
    const newAccount = await pool.query(
      'INSERT INTO accounts (name, owner_id, brand_color) VALUES (?,?, "#3365f6")',
      [name, userId]
    );

    return res.json({ accountId: newAccount[0].insertId });
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message
    });
  }
};