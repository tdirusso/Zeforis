const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    userId,
    orgId,
    isAdmin = false
  } = req.body;

  if (!userId) {
    return res.json({
      message: 'Missing permissions parameters.'
    });
  }

  const connection = await pool.getConnection();

  try {
    const [allOrgEngagementsResult] = await connection.query(
      'SELECT id FROM engagements WHERE org_id = ?',
      [orgId]
    );

    const newRole = isAdmin ? 'admin' : 'member';

    await connection.query(
      'UPDATE engagement_users SET role = ? WHERE engagement_id IN (?) AND user_id = ?',
      [newRole, allOrgEngagementsResult.map(({ id }) => id), userId]
    );

    connection.release();

    return res.json({ success: true });
  } catch (error) {
    connection.release();
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};