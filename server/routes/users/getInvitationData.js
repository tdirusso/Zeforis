const pool = require('../../../database');

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (req, res) => {
  const {
    userId,
    clientId,
    invitationCode
  } = req.query;

  if (!clientId || !userId || !invitationCode) {
    return res.json({
      message: 'Missing invitation params.'
    });
  }

  const connection = await pool.getConnection();

  try {
    const [invitationResult] = await connection.query(
      'SELECT user_id FROM client_users WHERE client_id = ? AND user_id = ? AND invitation_code = ?',
      [clientId, userId, invitationCode]
    );

    const invitation = invitationResult[0];

    if (!invitation) {
      connection.release();
      return res.json({
        message: 'No invitation found.'
      });
    }

    const [userResult] = await connection.query(
      'SELECT id, email, password FROM users WHERE id = ?',
      [userId]
    );

    const user = userResult[0];

    if (!user) {
      connection.release();
      return res.json({
        message: 'No invitation found.'
      });
    }

    const userNeedsPassword = !Boolean(user.password);

    connection.release();

    return res.json({
      invitation: {
        userNeedsPassword
      }
    });
  } catch (error) {
    console.log(error);
    connection.release();
    return res.json({
      message: error.message
    });
  }
};