const { pool } = require('../../../database');

module.exports = async (req, res, next) => {
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

    const [ownedOrg] = await pool.query('SELECT name FROM orgs WHERE owner_id = ?', [creatorUserId]);

    if (ownedOrg.length) {
      return res.json({
        message: `You already own an organization (${ownedOrg[0].name})`
      });
    }

    const newOrg = await pool.query(
      'INSERT INTO orgs (name, owner_id, brand_color) VALUES (?,?, "#3365f6")',
      [name, creatorUserId]
    );

    return res.json({ orgId: newOrg[0].insertId });
  } catch (error) {
    next(error);
  }
};