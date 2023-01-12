const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const emailService = require('../../email');
const validator = require("email-validator");
const pool = require('../../database');

const isDev = process.env.NODE_ENV === 'development';

module.exports = async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    clientId,
    clientName,
    accountId,
    accountName,
    isAdmin = false
  } = req.body;

  if (!clientId || !accountId) {
    return res.json({
      message: 'Missing clientId or accountId.'
    });
  }

  if (!firstName || !lastName || !email) {
    return res.json({
      message: 'Missing name or email.'
    });
  }

  if (!validator.validate(email)) {
    return res.json({ message: 'Email address is not valid.' });
  }

  try {
    const [userResult] = await pool.query(
      'SELECT id, first_name, last_name, email FROM users WHERE email = ?',
      [email.toLowerCase()]);

    const user = userResult[0];
    const role = isAdmin ? 'admin' : 'member';

    if (user) {
      await pool.query(
        'INSERT INTO client_users (client_id, user_id, role) VALUES (?,?,?) ON DUPLICATE KEY UPDATE role = ?',
        [clientId, user.id, role, role]
      );

      await sendInvitationEmail({
        email: email.toLowerCase(),
        clientId,
        accountId,
        accountName,
        clientName,
        templateFile: '../../email/templates/inviteExistingUser.ejs'
      });

      return res.json({ success: true, userId: user.id });
    } else {
      await sendInvitationEmail({
        email: email.toLowerCase(),
        clientId,
        accountId,
        accountName,
        clientName,
        templateFile: '../../email/templates/inviteNewUser.ejs',
        isNewUser: true
      });

      const newUserResult = await pool.query(
        'INSERT INTO users (first_name, last_name, email) VALUES (?,?,?)',
        [firstName, lastName, email.toLowerCase()]
      );

      const newUserId = newUserResult[0].insertId;

      await pool.query(
        'INSERT INTO client_users (client_id, user_id, role) VALUES (?,?,?)',
        [clientId, newUserId, role]
      );

      return res.json({ success: true, userId: newUserId });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message
    });
  }
};

async function sendInvitationEmail({ email, clientId, accountName, templateFile, clientName, accountId, isNewUser }) {
  let qs = `email=${email}&clientId=${clientId}&accountId=${accountId}`;

  let verificationUrl = isDev ? `http://localhost:3000` : 'google.com';

  if (isNewUser) {
    verificationUrl += `/complete-registration?${qs}`;
  } else {
    verificationUrl += `/home/dashboard?${qs}`;
  }

  const ejsData = {
    verificationUrl,
    accountName,
    clientName
  };

  const templatePath = path.resolve(__dirname, templateFile);
  const template = ejs.render(fs.readFileSync(templatePath, 'utf-8'), ejsData);

  await emailService.sendMail({
    from: 'Client Portal',
    to: email,
    subject: `Client Portal - ${accountName} has invited you to collaborate`,
    text: template,
    html: template
  });
}