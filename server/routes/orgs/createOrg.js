const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    name
  } = req.body;

  const creatorUserId = req.userId;

  if (!creatorUserId) {
    return res.json({
      message: 'Missing userId.'
    });
  }

  if (!name) {
    return res.json({
      message: 'Missing organization name.'
    });
  }

  try {
    const newOrg = await pool.query(
      'INSERT INTO orgs (name, owner_id, brand_color) VALUES (?,?, "#3365f6")',
      [name, creatorUserId]
    );

    return res.json({ orgId: newOrg[0].insertId });
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message
    });
  }
};