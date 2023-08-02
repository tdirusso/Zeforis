const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const emailService = require('../../../email');
const validator = require("email-validator");
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const pool = require('../../../database');

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (req, res) => {
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
        console.log(moment(user.date_password_reset_code_expiration).toDate());
        return res.json({
          success: true
        });
      } else {
        const passwordResetCode = uuidv4().substring(0, 16);
        const _1hourFromNow = moment().add('1', 'hours');
        console.log(passwordResetCode, _1hourFromNow.toDate(), user);

        await connection.query(
          'UPDATE users SET password_reset_code = ?, date_password_reset_code_expiration = ? WHERE id = ?',
          [passwordResetCode, _1hourFromNow.toDate(), user.id]
        );

        connection.release();

        return res.json({
          success: true
        });
      }
    } else {
      connection.release();

      return res.json({
        error: true,
        message: 'No user found with that email.'
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

async function sendVerifyEmail(userId, verificationCode, email) {
  const qs = `userId=${userId}&verificationCode=${verificationCode}`;

  const verificationUrl = `${process.env.API_DOMAIN}/api/users/verify?${qs}`;

  const ejsData = {
    verificationUrl
  };

  const templatePath = path.resolve(__dirname, '../../../email/templates/verifyEmail.ejs');
  const template = ejs.render(fs.readFileSync(templatePath, 'utf-8'), ejsData);

  await emailService.sendMail({
    from: 'Zeforis',
    to: email,
    subject: `Zeforis - Verify your Email`,
    text: template,
    html: template
  });
}