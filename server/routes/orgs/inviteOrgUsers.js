const emailService = require('../../email');
const validator = require("email-validator");
const { pool, commonQueries } = require('../../database');
const { v4: uuidv4 } = require('uuid');
const { appLimits, isDev } = require('../../config');
const { updateStripeSubscription } = require('../../lib/utils');

module.exports = async (req, res, next) => {
  const {
    usersToInvite = [],
    engagementId,
    engagementName,
    orgName,
    inviteType = 'member',
    orgColor = '#3365f6',
    orgLogo
  } = req.body;

  const updaterUserId = req.userId;
  const orgId = req.ownedOrg.id;

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

  if (usersToInvite.length >= 100) {
    return res.json({ message: 'Too many users to invite (must be less than 100).' });
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

  if (countNewEmails > appLimits.simultaneousEmailInvites) {
    return res.json({ message: `New emails to invite cannot exceed ${appLimits.simultaneousEmailInvites} - found ${countNewEmails}.` });
  }

  if (!allEmailsArray.length) {
    return res.json({ message: 'Did not find any valid emails to invite.' });
  }

  const connection = await pool.getConnection();

  await connection.beginTransaction();

  try {
    const orgOwnerPlan = await commonQueries.getOrgOwnerPlan(connection, orgId);

    if (orgOwnerPlan === 'free' && inviteType === 'admin') {
      return res.json({ message: 'Upgrade to Zeforis Pro to add administrators.' });
    }

    const [allExistingUsers] = await connection.query(
      'SELECT id, email, first_name, last_name FROM users WHERE email IN (?) AND id != ?',
      [allEmailsArray, updaterUserId]
    );

    const allEmailsToUserMap = {};
    const existingUsersEmails = allExistingUsers.map(user => {
      allEmailsToUserMap[user.email] = {
        id: user.id,
        isNew: false,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
      };

      return user.email;
    });

    const newEmails = allEmailsArray.filter(email => !existingUsersEmails.includes(email));

    if (newEmails.length) {
      const [newUsersResult] = await connection.query(
        'INSERT INTO users (email) VALUES ?',
        [newEmails.map(email => [email])]
      );

      let insertId = newUsersResult.insertId;

      newEmails.forEach(email =>
        allEmailsToUserMap[email] = {
          id: insertId++,
          isNew: true,
          firstName: '',
          lastName: '',
          email
        });
    }

    const invitationEmails = [];

    const insertEngagementUsersValues = allEmailsArray.map(email => {
      const userDetails = allEmailsToUserMap[email];
      const userId = userDetails.id;
      const needsInvitationCode = userDetails.isNew;

      const invitationCode = needsInvitationCode ? uuidv4().substring(0, 16) : null;
      const role = inviteType === 'admin' ? 'admin' : 'member';

      const invitationUrl =
        needsInvitationCode ?
          `${process.env.APP_DOMAIN}/accept-invitation?engagementId=${engagementId}&userId=${userId}&invitationCode=${invitationCode}&orgId=${orgId}` :
          `${process.env.APP_DOMAIN}/login?cp=${Buffer.from(`orgId=${orgId}`).toString('base64')}&engagementId=${engagementId}`;

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

    await connection.query(
      `INSERT INTO engagement_users (engagement_id, user_id, role, invitation_code) 
        VALUES ?
        ON DUPLICATE KEY UPDATE role = VALUES(role), invitation_code = VALUES(invitation_code)`,
      [insertEngagementUsersValues]
    );

    if (inviteType === 'admin') {
      const { success, message } = await updateStripeSubscription(connection, updaterUserId, orgId);

      if (!success) {
        await connection.rollback();

        connection.release();
        return res.json({ message });
      }
    }

    await emailService.sendMultipleEmailsFromTemplate(invitationEmails);

    await connection.commit();

    connection.release();

    return res.json({
      success: true,
      invitedUsers: Object.values(allEmailsToUserMap)
    });

  } catch (error) {
    await connection.rollback();

    connection.release();
    next(error);
  }
};