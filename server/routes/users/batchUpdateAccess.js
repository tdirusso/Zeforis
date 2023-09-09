const { pool } = require('../../../database');

module.exports = async (req, res, next) => {
  const {
    userId,
    orgId,
    hasAccess = false
  } = req.body;

  if (!userId) {
    return res.json({
      message: 'Missing access parameters.'
    });
  }

  const updaterUserId = req.userId;

  if (userId === updaterUserId) {
    return res.json({
      message: 'You cannot update your own access.'
    });
  }

  const connection = await pool.getConnection();

  try {
    const [allOrgEngagementsResult] = await connection.query(
      'SELECT id FROM engagements WHERE org_id = ?',
      [orgId]
    );

    if (hasAccess) {
      const insertValues = allOrgEngagementsResult.map(engagement => [engagement.id, userId, 'member']);

      await connection.query('INSERT IGNORE INTO engagement_users (engagement_id, user_id, role) VALUES ?',
        [insertValues]
      );

    } else {
      await connection.query(
        `
          UPDATE tasks 
          SET assigned_to_id = NULL
          WHERE assigned_to_id = ? AND folder_id IN 
            (
              SELECT id FROM folders WHERE engagement_id IN 
              (SELECT id FROM engagements WHERE org_id = ?)
            )
        `,
        [userId, orgId]
      );

      await connection.query(
        'DELETE FROM engagement_users WHERE engagement_id IN (?) AND user_id = ?',
        [allOrgEngagementsResult.map(({ id }) => id), userId]
      );
    }

    connection.release();

    return res.json({ success: true });
  } catch (error) {
    connection.release();
    next(error);
  }
};