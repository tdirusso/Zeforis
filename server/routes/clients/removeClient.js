const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    clientId
  } = req.body;

  if (!clientId) {
    return res.json({
      message: 'Missing clientId.'
    });
  }

  try {
    await pool.query('DELETE FROM clients WHERE id = ?', [clientId]);

    return res.json({ success: true });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};