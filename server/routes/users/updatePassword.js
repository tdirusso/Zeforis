const bcrypt = require('bcrypt');
const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    userId,
    clientId,
    invitationCode,
    resetType = 'email',
    password
  } = req.body;

  if (!userId || !password || (resetType === 'invitation' && (!invitationCode || !clientId))) {
    return res.json({ message: 'Missing password reset parameters.' });
  }

  const connection = await pool.getConnection();

  try {
    const [userResult] = await connection.query('SELECT id, password FROM users WHERE id = ?', [userId]);

    const user = userResult[0];

    if (!user) {
      return res.json({
        message: 'User does not exist.'
      });
    }

    if (resetType === 'invitation') {
      const [invitationResult] = await connection.query(
        'SELECT user_id FROM client_users WHERE client_id = ? AND user_id = ? AND invitation_code = ?',
        [clientId, userId, invitationCode]
      );

      const invitation = invitationResult[0];

      if (!invitation) {
        return res.json({
          message: 'Invalid credential combination.'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await connection.query(
        'UPDATE users SET is_verified = 1, password = ? WHERE id = ?',
        [hashedPassword, userId]
      );

      connection.release();

      return res.json({
        success: true
      });
    }

  } catch (error) {
    console.log(error);
    connection.release();
    return res.json({
      message: error.message
    });
  }
};