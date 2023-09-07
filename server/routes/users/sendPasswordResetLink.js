const emailService = require('../../../email');
const validator = require("email-validator");
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const { pool } = require('../../../database');

module.exports = async (req, res, next) => {
  const {
    email
  } = req.body;

  if (!email || !validator.validate(email)) {
    return res.json({
      message: 'Missing or invalid email.'
    });
  }

  const connection = await pool.getConnection();

  try {
    const [userResult] = await pool.query('SELECT id, date_password_reset_code_expiration FROM users WHERE email = ?', [email.toLowerCase()]);

    if (userResult.length) {
      const user = userResult[0];

      if (user.date_password_reset_code_expiration) {
        const passwordLinkExpirationTime = moment(user.date_password_reset_code_expiration);
        const now = moment();

        if (passwordLinkExpirationTime.isAfter(now)) {
          connection.release();
          return res.json({
            success: true,
            isLinkPending: true
          });
        }
      }

      const passwordResetCode = uuidv4().substring(0, 16);
      const _1hourFromNow = moment().add('1', 'hours');

      await connection.query(
        'UPDATE users SET password_reset_code = ?, date_password_reset_code_expiration = ? WHERE id = ?',
        [passwordResetCode, _1hourFromNow.toDate(), user.id]
      );

      await sendPasswordResetLink(passwordResetCode, email.toLowerCase());

      connection.release();

      return res.json({
        success: true
      });
    } else {
      connection.release();

      return res.json({
        error: true,
        message: 'No user found with that email.'
      });
    }
  } catch (error) {
    connection.release();
    next(error);
  }
};

async function sendPasswordResetLink(resetCode, email) {
  const qs = `resetCode=${resetCode}&email=${email}`;

  const passwordResetUrl = `${process.env.REACT_APP_APP_DOMAIN}/password-reset?${qs}`;

  await emailService.sendEmailFromTemplate({
    to: email,
    from: emailService.senders.info,
    templateId: emailService.templates.passwordReset,
    templateData: {
      passwordResetUrl
    }
  });
}