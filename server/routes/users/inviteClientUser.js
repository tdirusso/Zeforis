const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const emailService = require('../../../email');
const validator = require("email-validator");
const pool = require('../../../database');
const { v4: uuidv4 } = require('uuid');

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (req, res) => {
  const {
    email,
    clientId,
    clientName,
    orgId,
    orgName,
    orgColor,
    orgLogo = 'https://zeforis.s3.us-west-1.amazonaws.com/assets/zeforis-logo.png',
    isAdmin = false
  } = req.body;

  if (!clientId || !orgId) {
    return res.json({
      message: 'Missing clientId or orgId.'
    });
  }

  if (!email) {
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

    const invitationCode = uuidv4().substring(0, 16);

    if (user) {
      await pool.query(
        'INSERT INTO client_users (client_id, user_id, role, invitation_code) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE role = ?, invitation_code = ?',
        [clientId, user.id, role, invitationCode, role, invitationCode]
      );

      await sendInvitationEmail({
        email: email.toLowerCase(),
        clientId,
        userId: user.id,
        orgName,
        clientName,
        orgColor,
        orgLogo,
        invitationCode
      });

      return res.json({
        success: true,
        userId: user.id,
        firstName: user.first_name,
        lastName: user.last_name
      });
    } else {
      const newUserResult = await pool.query(
        'INSERT INTO users (email) VALUES (?)',
        [email.toLowerCase()]
      );

      const newUserId = newUserResult[0].insertId;

      await pool.query(
        'INSERT INTO client_users (client_id, user_id, role, invitation_code) VALUES (?,?,?,?)',
        [clientId, newUserId, role, invitationCode]
      );

      await sendInvitationEmail({
        email: email.toLowerCase(),
        clientId,
        userId: newUserId,
        orgName,
        clientName,
        orgColor,
        orgLogo,
        invitationCode
      });

      return res.json({ success: true, userId: newUserId });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message
    });
  }
};

async function sendInvitationEmail({ email, clientId, orgName, clientName, userId, orgColor, orgLogo, invitationCode }) {
  let qs = `clientId=${clientId}&userId=${userId}&invitationCode=${invitationCode}`;

  let verificationUrl = `${process.env.APP_DOMAIN}/accept-invitation?${qs}`;

  const ejsData = {
    verificationUrl,
    orgName,
    clientName,
    orgColor,
    orgLogo,
    invitationCode
  };

  const templatePath = path.resolve(__dirname, '../../../email/templates/inviteUser.ejs');
  const template = ejs.render(fs.readFileSync(templatePath, 'utf-8'), ejsData);

  await emailService.sendMail({
    from: `${orgName} Client Portal - Zeforis`,
    to: email,
    subject: `${orgName} has invited you to collaborate`,
    text: template,
    html: template
  });
}