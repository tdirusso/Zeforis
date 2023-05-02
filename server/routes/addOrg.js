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
    const newOrg = await pool.query(
      'INSERT INTO orgs (name, owner_id, brand_color) VALUES (?,?, "#3365f6")',
      [name, userId]
    );

    return res.json({ orgId: newOrg[0].insertId });
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message
    });
  }
};