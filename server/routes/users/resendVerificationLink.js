const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const emailService = require('../../../email');
const validator = require("email-validator");
const { v4: uuidv4 } = require('uuid');

const { pool } = require('../../../database');

module.exports = async (req, res, next) => {
  const {
    email
  } = req.body;

  if (!email || !validator.validate(email)) {
    return res.json({
      message: 'Invalid email address.'
    });
  }

  try {
    const [userResult] = await pool.query('SELECT id, is_verified FROM users WHERE email = ?', [email.toLowerCase()]);

    if (userResult.length) {
      const user = userResult[0];

      if (user.is_verified) {
        return res.json({
          message: 'User is already verified.'
        });
      }

      const verificationCode = uuidv4().substring(0, 16);

      await pool.query(
        'UPDATE users SET verification_code = ? WHERE id = ?',
        [verificationCode, user.id]);

      await sendVerifyEmail(user.id, verificationCode, email);

      return res.json({ success: true });
    }

    return res.json({
      message: 'User does not exist.'
    });
  } catch (error) {
    next(error);
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