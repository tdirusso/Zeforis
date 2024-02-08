const { pool } = require('../../database');

module.exports = async (req, res, next) => {
  const orgId = req.ownedOrg.id;

  if (!orgId) {
    return res.json({
      message: 'Missing engagementId.'
    });
  }

  try {
    await pool.query('DELETE FROM orgs WHERE id = ?', [orgId]);

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};