const emailService = require('../../../email');
const validator = require("email-validator");
const { pool } = require('../../../database');
const { v4: uuidv4 } = require('uuid');
const { appConstants, isDev } = require('../../../config');

module.exports = async (req, res, next) => {
  const {
    usersToInvite = [],
    engagementId,
    orgId,
    engagementName,
    orgName,
    inviteType = 'member',
    orgColor = '#3365f6',
    orgLogo
  } = req.body;

  const updaterUserId = req.userId;

  if (!engagementId || !orgId) {
    return res.json({
      message: 'Missing engagementId or orgId.'
    });
  }

  if (!usersToInvite.length) {
    return res.json({
      message: 'Missing users to invite.'
    });
  }

  if (usersToInvite.length >= 500) {
    return res.json({ message: 'Too many users to invite (must be less than 500).' });
  }

  const invalidOrMissingEmails = [];
  const allEmailsArray = [];
  let countNewEmails = 0;

  usersToInvite.forEach(user => {
    const email = user.email?.toLowerCase();

    if (!email || !validator.validate(email)) {
      invalidOrMissingEmails.push(user);
    } else {
      if (!user.id) {
        countNewEmails++;
      }

      allEmailsArray.push(email);
    }
  });

  if (invalidOrMissingEmails.length) {
    return res.json({ message: `Missing or invalid emails for the following objects:  ${JSON.stringify(invalidOrMissingEmails)}` });
  }

  if (countNewEmails > appConstants.limits.invites) {
    return res.json({ message: `New emails to invite cannot exceed ${appConstants.limits.invites} - found ${countNewEmails}.` });
  }

  const connection = await pool.getConnection();

  try {

    await connection.beginTransaction();

    const [existingUsers] = await connection.query(
      'SELECT id, email, is_verified FROM users WHERE email IN (?) AND id != ?',
      [allEmailsArray, updaterUserId]
    );

    const allEmailsToUserIdMap = {};
    const existingUsersEmails = existingUsers.map(({ id, email, is_verified }) => {
      allEmailsToUserIdMap[email] = {
        id,
        isNew: false,
        isVerified: is_verified
      };

      return email;
    });

    const newEmails = allEmailsArray.filter(email => !existingUsersEmails.includes(email));

    if (newEmails.length) {
      const [newUsersResult] = await connection.query(
        'INSERT INTO users (email) VALUES (?)',
        [newEmails]
      );

      let insertId = newUsersResult.insertId;

      newEmails.forEach(email => allEmailsToUserIdMap[email] = {
        id: insertId++,
        isNew: true
      });
    }

    const invitationEmails = [];

    const insertEngagementUsersValues = allEmailsArray.map(email => {
      const userDetails = allEmailsToUserIdMap[email];
      const userId = userDetails.id;
      const needsInvitationEmail = userDetails.isNew || !userDetails.isVerified;

      const invitationCode = needsInvitationEmail ? uuidv4().substring(0, 16) : null;
      const role = inviteType === 'admin' ? 'admin' : 'member';

      const qs = `engagementId=${engagementId}&userId=${userId}&invitationCode=${invitationCode}&orgId=${orgId}`;
      const invitationUrl = `${process.env.REACT_APP_APP_DOMAIN}/accept-invitation?${qs}`;

      invitationEmails.push({
        to: email,
        from: emailService.senders.info,
        templateId: emailService.templates.engagementInvitation,
        dynamicTemplateData: {
          invitationUrl,
          orgName,
          engagementName,
          orgColor,
          orgLogo
        },
        hideWarnings: !isDev
      });

      return [
        engagementId,
        userId,
        role,
        invitationCode
      ];
    });

    console.log(insertEngagementUsersValues);

    await connection.query(
      `INSERT INTO engagement_users (engagement_id, user_id, role, invitation_code) 
        VALUES ?
        ON DUPLICATE KEY UPDATE role = VALUES(role), invitation_code = VALUES(invitation_code)`,
      [insertEngagementUsersValues]
    );

    await connection.commit();

    console.log('Will send these emails:', invitationEmails);

    connection.release();

    return res.json({ success: true });

    //await connection.beginTransaction();











    // const lcEmail = email.toLowerCase();

    // const [userResult] = await pool.query(
    //   'SELECT id, first_name, last_name, email FROM users WHERE email = ?',
    //   [lcEmail]);

    // const user = userResult[0];
    // const role = isAdmin ? 'admin' : 'member';

    // const invitationCode = uuidv4().substring(0, 16);

    // if (user) {
    //   const [memberExistsResult] = await pool.query(
    //     'SELECT 1 FROM engagement_users WHERE engagement_id = ? AND user_id = ?',
    //     [engagementId, user.id]
    //   );

    //   if (memberExistsResult.length) {
    //     return res.json({
    //       message: 'User is already part of this engagement.'
    //     });
    //   }

    //   await pool.query(
    //     'INSERT INTO engagement_users (engagement_id, user_id, role, invitation_code) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE role = ?, invitation_code = ?',
    //     [engagementId, user.id, role, invitationCode, role, invitationCode]
    //   );

    //   await sendInvitationEmail({
    //     email: lcEmail,
    //     engagementId,
    //     userId: user.id,
    //     orgName,
    //     engagementName,
    //     orgColor,
    //     orgLogo,
    //     invitationCode,
    //     orgId
    //   });

    //   return res.json({
    //     success: true,
    //     userId: user.id,
    //     firstName: user.first_name,
    //     lastName: user.last_name
    //   });
    // } else {
    //   const newUserResult = await pool.query(
    //     'INSERT INTO users (email) VALUES (?)',
    //     [lcEmail]
    //   );

    //   const newUserId = newUserResult[0].insertId;

    //   await pool.query(
    //     'INSERT INTO engagement_users (engagement_id, user_id, role, invitation_code) VALUES (?,?,?,?)',
    //     [engagementId, newUserId, role, invitationCode]
    //   );

    //   await sendInvitationEmail({
    //     email: lcEmail,
    //     engagementId,
    //     userId: newUserId,
    //     orgName,
    //     engagementName,
    //     orgColor,
    //     orgLogo,
    //     invitationCode,
    //     orgId
    //   });

    //   return res.json({ success: true, userId: newUserId });
    // }
  } catch (error) {
    await connection.rollback();
    connection.release();
    next(error);
  }
};