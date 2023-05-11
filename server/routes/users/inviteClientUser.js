const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const emailService = require('../../../email');
const validator = require("email-validator");
const pool = require('../../../database');

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    clientId,
    clientName,
    orgId,
    orgName,
    orgBrand,
    isAdmin = false
  } = req.body;

  if (!clientId || !orgId) {
    return res.json({
      message: 'Missing clientId or orgId.'
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
        orgId,
        orgName,
        clientName,
        orgBrand,
      });

      return res.json({ success: true, userId: user.id });
    } else {
      await sendInvitationEmail({
        email: email.toLowerCase(),
        clientId,
        orgId,
        orgName,
        clientName,
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

async function sendInvitationEmail({ email, clientId, orgName, clientName, orgId, isNewUser, orgBrand }) {
  let qs = `email=${email}&clientId=${clientId}&orgId=${orgId}`;

  let verificationUrl = process.env.APP_DOMAIN;

  if (isNewUser) {
    verificationUrl += `/complete-registration?${qs}`;
  } else {
    verificationUrl += `/home/dashboard?${qs}`;
  }

  const ejsData = {
    verificationUrl,
    orgName,
    clientName,
    orgBrand
  };

  const templatePath = path.resolve(__dirname, '../../email/templates/inviteUser.ejs');
  const template = ejs.render(fs.readFileSync(templatePath, 'utf-8'), ejsData);

  await emailService.sendMail({
    from: `${orgName} Client  - Zeforis`,
    to: email,
    subject: `${orgName} has invited you to collaborate`,
    text: template,
    html: template
  });
}