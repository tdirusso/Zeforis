const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    orgId
  } = req.body;

  if (!orgId) {
    return res.json({
      message: 'Missing engagementId.'
    });
  }

  try {
    await pool.query('DELETE FROM orgs WHERE id = ?', [orgId]);

    return res.json({ success: true });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};