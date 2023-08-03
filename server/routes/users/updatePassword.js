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

  if (type === 'complete-registration') {
    handleUpdatePassword(req, res);
  } else if (type === 'reset') {
    handleResetPassword(req, res);
  } else {
    return res.json({
      error: true,
      message: 'Invalid reset type.'
    });
  }
};

async function handleUpdatePassword(req, res) {
  const {
    userId,
    engagementId,
    invitationCode,
    password
  } = req.body;

  if (!userId || !password || !invitationCode || !engagementId) {
    return res.json({ message: 'Missing password update parameters.' });
  }

  try {
    const [userResult] = await pool.query('SELECT id, password FROM users WHERE id = ?', [userId]);

    const user = userResult[0];

    if (!user) {
      return res.json({
        message: 'User does not exist.'
      });
    }

    const [invitationResult] = await pool.query(
      'SELECT user_id FROM engagement_users WHERE engagement_id = ? AND user_id = ? AND invitation_code = ?',
      [engagementId, userId, invitationCode]
    );

    const invitation = invitationResult[0];

    if (!invitation) {
      return res.json({
        message: 'Invalid credential combination.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'UPDATE users SET is_verified = 1, password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    return res.json({
      success: true
    });

  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message
    });
  }
}

async function handleResetPassword(req, res) {
  const {
    email,
    password,
    resetCode
  } = req.body;

  if (!email || !password || !resetCode) {
    return res.json({ message: 'Missing password reset parameters.' });
  }

  if (!validator.validate(email)) {
    return res.json({
      message: 'Invalid email address'
    });
  }

  try {
    const [userResult] = await pool.query(
      'SELECT id, password_reset_code, date_password_reset_code_expiration FROM users WHERE email = ?',
      [email.toLowerCase()]);

    const user = userResult[0];

    if (!user) {
      return res.json({
        message: 'User does not exist.'
      });
    }

    if (!user.password_reset_code) {
      return res.json({
        message: 'Password reset has not been requested.'
      });
    }

    const now = moment();
    const resetCodeExpiration = moment(user.date_password_reset_code_expiration);

    if (resetCodeExpiration.isBefore(now)) {
      return res.json({
        message: 'Password reset code has expired - must request a new reset link.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'UPDATE users SET is_verified = 1, password = ?, password_reset_code = NULL, date_password_reset_code_expiration = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    return res.json({
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message
    });
  }
}