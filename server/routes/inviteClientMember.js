const User = require('../../models/user');
const Client = require('../../models/client');
const Account = require('../../models/account');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const emailService = require('../../email');
const validator = require("email-validator");

const isDev = process.env.NODE_ENV === 'development';

module.exports = async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    clientId,
    accountId
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
    const user = await User.findOne({ email: email.toLowerCase() });
    const client = await Client.findById(clientId);
    const account = await Account.findById(accountId);

    if (!client || !account) {
      return res.json({ message: 'Account or client does not exist.' });
    }

    if (user) {
      const isUserAlreadyMemberOfClient = user.memberOfClients.some(id => id.toString() === clientId);
      const isUserAlreadyAdminOfClient = user.adminOfClients.some(id => id.toString() === clientId);
      const isUserPartOfAccount = user.memberOfAccounts.some(id => id.toString() === accountId);

      if (isUserAlreadyMemberOfClient) {
        return res.json({ message: `${email} is already a member of ${client.name}` });
      } else if (isUserAlreadyAdminOfClient) {
        return res.json({ message: `${email} is already an administrator of ${client.name}` });
      }

      //TODO enable account org branding in email
      await sendInvitationEmail({
        email: email.toLowerCase(),
        clientId,
        accountId,
        accountName: account.name,
        clientName: client.name,
        templateFile: '../../email/templates/inviteExistingUser.ejs'
      });

      user.memberOfClients.push(clientId);

      client.members.push(user._id);

      if (!isUserPartOfAccount) {
        account.members.push(user._id);
        user.memberOfAccounts.push(accountId);

        await account.save();
      }

      await user.save();
      await client.save();

      return res.json({ success: true });
    } else {
      await sendInvitationEmail(
        {
          email: email.toLowerCase(),
          clientId,
          accountId,
          accountName: account.name,
          clientName: client.name,
          templateFile: '../../email/templates/inviteNewUser.ejs',
          isNewUser: true
        }
      );

      const newUser = await User.create({
        email,
        firstName,
        lastName
      });

      newUser.memberOfAccounts = [accountId];
      newUser.memberOfClients = [clientId];
      account.members.push(newUser._id);
      client.members.push(newUser._id);

      await newUser.save();
      await account.save();
      await client.save();

      return res.json({ success: true });
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