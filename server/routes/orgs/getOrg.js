const { pool } = require('../../database');

module.exports = async (req, res, next) => {
  const {
    orgId
  } = req.query;

  if (!orgId) {
    return res.json({
      message: 'Missing orgId.'
    });
  }

  try {
    const [orgResult] = await pool.query(
      'SELECT name, brand_color, logo_url FROM orgs WHERE id = ?',
      [orgId]
    );

    const org = orgResult[0];

    if (org) {
      return res.json({
        org
      });
    }

    return res.json({
      error: 'Org does not exist.'
    });
  } catch (error) {
    next(error);
  }
};