const User = require('../../models/user');
const Client = require('../../models/client');
const Account = require('../../models/account');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const emailService = require('../../email');

const isDev = process.env.NODE_ENV === 'development';

module.exports = async (req, res) => {
  const {
    email,
    clientId,
    accountId
  } = req.body;

  if (!clientId || !email) {
    return res.json({
      message: 'Missing clientId or email.'
    });
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

      user.memberOfClients.push(clientId);

      client.members.push(user._id);

      if (!isUserPartOfAccount) {
        account.members.push(user._id);
        user.memberOfAccounts.push(accountId);

        await account.save();
      }

      await user.save();
      await client.save();

      //TODO enable account org branding in email
      await sendInvitationEmail({
        email: email.toLowerCase(),
        clientId,
        accountName: account.name,
        clientName: client.name,
        templateFile: '../../email/templates/inviteExistingUser.ejs'
      });

      return res.json({ success: true });
    } else {

      const verificationCode = Math.floor(1000 + Math.random() * 9000);

      const newUser = await User.create({
        email,
        verificationCode
      });

      newUser.memberOfAccounts = [accountId];
      account.members.push(newUser._id);
      client.members.push(newUser._id);

      await newUser.save();
      await account.save();
      await client.save();

      await sendInvitationEmail(
        {
          email: email.toLowerCase(),
          clientId,
          accountName: account.name,
          verificationCode,
          clientName: client.name,
          templateFile: '../../email/templates/inviteNewUser.ejs'
        }
      );

      return res.json({ success: true });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message
    });
  }
};

async function sendInvitationEmail({ email, clientId, accountName, templateFile, clientName, verificationCode }) {
  let qs = `email=${email}&clientId=${clientId}`;

  if (verificationCode) {
    qs += `&verificationCode=${verificationCode}`;
  }

  const verificationUrl = isDev ?
    `http://localhost:8080/api/acceptInvitation?${qs}` :
    `google.com`;

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