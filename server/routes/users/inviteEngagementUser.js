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
    engagementId,
    engagementName,
    orgId,
    orgName,
    orgColor,
    orgLogo = 'https://zeforis.s3.us-west-1.amazonaws.com/assets/zeforis-logo.png',
    isAdmin = false
  } = req.body;

  if (!engagementId || !orgId) {
    return res.json({
      message: 'Missing engagementId or orgId.'
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
      const [memberExistsResult] = await pool.query(
        'SELECT 1 FROM engagement_users WHERE engagement_id = ? AND user_id = ?',
        [engagementId, user.id]
      );

      if (memberExistsResult.length) {
        return res.json({
          message: 'User is already part of this engagement.'
        });
      }

      await pool.query(
        'INSERT INTO engagement_users (engagement_id, user_id, role, invitation_code) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE role = ?, invitation_code = ?',
        [engagementId, user.id, role, invitationCode, role, invitationCode]
      );

      await sendInvitationEmail({
        email: email.toLowerCase(),
        engagementId,
        userId: user.id,
        orgName,
        engagementName,
        orgColor,
        orgLogo,
        invitationCode,
        orgId
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
        'INSERT INTO engagement_users (engagement_id, user_id, role, invitation_code) VALUES (?,?,?,?)',
        [engagementId, newUserId, role, invitationCode]
      );

      await sendInvitationEmail({
        email: email.toLowerCase(),
        engagementId,
        userId: newUserId,
        orgName,
        engagementName,
        orgColor,
        orgLogo,
        invitationCode,
        orgId
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

async function sendInvitationEmail({ email, engagementId, orgName, engagementName, userId, orgColor, orgLogo, invitationCode, orgId }) {
  let qs = `engagementId=${engagementId}&userId=${userId}&invitationCode=${invitationCode}&orgId=${orgId}`;

  let verificationUrl = `${process.env.APP_DOMAIN}/accept-invitation?${qs}`;

  const ejsData = {
    verificationUrl,
    orgName,
    engagementName,
    orgColor,
    orgLogo,
    invitationCode
  };

  const templatePath = path.resolve(__dirname, '../../../email/templates/inviteUser.ejs');
  const template = ejs.render(fs.readFileSync(templatePath, 'utf-8'), ejsData);

  await emailService.sendMail({
    from: `${orgName} Engagement Portal - Zeforis`,
    to: email,
    subject: `${orgName} has invited you to collaborate`,
    text: template,
    html: template
  });
}