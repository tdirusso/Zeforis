const bcrypt = require('bcrypt');
const validator = require("email-validator");
const pool = require('../../../database');
const moment = require('moment');

module.exports = async (req, res) => {
  const {
    type
  } = req.body;

  if (!type) {
    return res.json({
      error: true,
      message: 'Missing reset type.'
    });
  }

  const connection = await pool.getConnection();

  if (type === 'complete-registration') {
    handleCompleteRegistration(req, res, connection);
  } else if (type === 'reset') {
    handleResetPassword(req, res, connection);
  } else {
    return res.json({
      error: true,
      message: 'Invalid reset type.'
    });
  }
};

async function handleCompleteRegistration(req, res, connection) {
  const {
    userId,
    engagementId,
    invitationCode,
    password,
    firstName,
    lastName
  } = req.body;

  if (!userId || !password || !invitationCode || !engagementId || !firstName || !lastName) {
    connection.release();
    return res.json({ message: 'Missing registration parameters.' });
  }

  try {
    const [userResult] = await connection.query('SELECT id, password FROM users WHERE id = ?', [userId]);

    const user = userResult[0];

    if (!user) {
      connection.release();
      return res.json({
        message: 'User does not exist.'
      });
    }

    const [invitationResult] = await connection.query(
      'SELECT user_id FROM engagement_users WHERE engagement_id = ? AND user_id = ? AND invitation_code = ?',
      [engagementId, userId, invitationCode]
    );

    const invitation = invitationResult[0];

    if (!invitation) {
      connection.release();
      return res.json({
        message: 'Invalid credentials.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query(
      'UPDATE users SET is_verified = 1, password = ?, first_name = ?, last_name = ? WHERE id = ?',
      [hashedPassword, firstName, lastName, userId]
    );

    await connection.query(
      'UPDATE engagement_users SET invitation_code = NULL WHERE engagement_id = ? AND user_id = ? AND invitation_code = ?',
      [engagementId, userId, invitationCode]
    );

    connection.release();

    return res.json({
      success: true
    });

  } catch (error) {
    connection.release();
    console.log(error);
    return res.json({
      message: error.message
    });
  }
}

async function handleResetPassword(req, res, connection) {
  const {
    email,
    password,
    resetCode
  } = req.body;

  if (!email || !password || !resetCode) {
    connection.release();
    return res.json({ message: 'Missing password reset parameters.' });
  }

  if (!validator.validate(email)) {
    connection.release();
    return res.json({
      message: 'Invalid email address'
    });
  }

  try {
    const [userResult] = await connection.query(
      'SELECT id, password_reset_code, date_password_reset_code_expiration FROM users WHERE email = ?',
      [email.toLowerCase()]);

    const user = userResult[0];

    if (!user) {
      connection.release();
      return res.json({
        message: 'User does not exist.'
      });
    }

    if (!user.password_reset_code) {
      connection.release();
      return res.json({
        message: 'Password reset has not been requested.'
      });
    }

    const now = moment();
    const resetCodeExpiration = moment(user.date_password_reset_code_expiration);

    if (resetCodeExpiration.isBefore(now)) {
      connection.release();
      return res.json({
        message: 'Password reset code has expired - must request a new reset link.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query(
      'UPDATE users SET is_verified = 1, password = ?, password_reset_code = NULL, date_password_reset_code_expiration = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    connection.release();

    return res.json({
      success: true
    });
  } catch (error) {
    connection.release();

    console.log(error);
    return res.json({
      message: error.message
    });
  }
}