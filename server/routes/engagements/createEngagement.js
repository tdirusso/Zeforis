const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    name,
    orgId
  } = req.body;

  const { userId } = req;

  if (!name) {
    return res.json({
      message: 'Missing engagement name.'
    });
  }

  const connection = await pool.getConnection();

  try {
    const newEngagement = await connection.query(
      'INSERT INTO engagements (name, org_id) VALUES (?,?)',
      [name, orgId]
    );

    const newEngagementId = newEngagement[0].insertId;

    await connection.query(
      'INSERT INTO engagement_users (engagement_id, user_id, role) VALUES (?,?, "admin")',
      [newEngagementId, userId]
    );

    const engagementObject = {
      id: newEngagementId,
      name,
      orgId
    };

    connection.release();

    return res.json({ engagement: engagementObject });
  } catch (error) {
    console.log(error);
    connection.release();

    return res.json({
      message: error.message
    });
  }
};