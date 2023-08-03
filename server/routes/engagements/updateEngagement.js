const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    name,
    engagementId
  } = req.body;

  if (!engagementId) {
    return res.json({
      message: 'No engagement ID supplied.'
    });
  }

  if (!name) {
    return res.json({
      message: 'Missing engagement name.'
    });
  }

  try {
    const [engagementResult] = await pool.query(
      'SELECT org_id FROM engagements WHERE id = ?',
      [engagementId]
    );

    const engagement = engagementResult[0];

    if (engagement) {
      await updateEngagement(name, engagementId);

      return res.json({
        success: true
      });
    }

    return res.json({ message: 'Engagement does not exist.' });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};

async function updateEngagement(name, engagementId) {
  await pool.query(
    'UPDATE engagements SET name = ? WHERE id = ?',
    [name, engagementId]
  );
}