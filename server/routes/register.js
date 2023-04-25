const bcrypt = require('bcrypt');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const emailService = require('../../email');
const validator = require("email-validator");

const pool = require('../../database');

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    password,
    orgName
  } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.json({
      message: 'Missing registration parameters.'
    });
  }

  if (!validator.validate(email)) {
    return res.json({ message: 'Email address is not valid.' });
  }

  try {
    const [existsResult] = await pool.query('SELECT 1 FROM users WHERE email = ?', [email.toLowerCase()]);

    if (existsResult.length) {
      return res.json({
        message: `"${email}" is already in use.  Please sign in instead.`
      });
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUserResult = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password, verification_code) VALUES (?,?,?,?,?)',
      [firstName, lastName, email.toLowerCase(), hashedPassword, verificationCode]);

    const userId = createUserResult[0].insertId;

    await pool.query(
      'INSERT INTO accounts (name, owner_id, brand_color) VALUES (?,?, "#3365f6")',
      [orgName, userId]
    );

    await sendVerifyEmail(email, verificationCode);

    return res.json({
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message
    });
  }
};

async function sendVerifyEmail(email, verificationCode) {
  const qs = `email=${email}&verificationCode=${verificationCode}`;

  const verificationUrl = `${process.env.API_DOMAIN}/verify?${qs}`;

  const ejsData = {
    verificationUrl
  };

  const templatePath = path.resolve(__dirname, '../../email/templates/verifyEmail.ejs');
  const template = ejs.render(fs.readFileSync(templatePath, 'utf-8'), ejsData);

  await emailService.sendMail({
    from: 'Zeforis',
    to: email,
    subject: `Zeforis - Verify your Email`,
    text: template,
    html: template
  });
}