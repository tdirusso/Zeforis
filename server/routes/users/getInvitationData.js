const { pool } = require('../../database');

module.exports = async (req, res, next) => {
  const {
    userId,
    engagementId,
    invitationCode
  } = req.query;

  if (!engagementId || !userId || !invitationCode) {
    return res.json({
      message: 'Missing invitation params.'
    });
  }

  const connection = await pool.getConnection();

  try {
    const [invitationResult] = await connection.query(
      'SELECT user_id FROM engagement_users WHERE engagement_id = ? AND user_id = ? AND invitation_code = ?',
      [engagementId, userId, invitationCode]
    );

    const invitation = invitationResult[0];

    if (!invitation) {
      connection.release();
      return res.json({
        message: 'No invitation found.'
      });
    }

    const [userResult] = await connection.query(
      'SELECT id, email, password, first_name FROM users WHERE id = ?',
      [userId]
    );

    const user = userResult[0];

    if (!user) {
      connection.release();
      return res.json({
        message: 'No invitation found.'
      });
    }

    //User used Google (passwordless) if first name exists and no password
    const userNeedsPassword = Boolean(!user.password && !user.first_name);

    if (!userNeedsPassword) {
      await connection.query(
        'UPDATE engagement_users SET invitation_code = NULL WHERE engagement_id = ? AND user_id = ? AND invitation_code = ?',
        [engagementId, userId, invitationCode]
      );
    }

    connection.release();

    return res.json({
      invitation: {
        userNeedsPassword
      }
    });
  } catch (error) {
    connection.release();
    next(error);
  }
};