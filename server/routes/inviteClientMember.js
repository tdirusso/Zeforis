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
    const user = await User.find({ email: email.toLowerCase() });
    const client = await Client.findById(clientId);
    const account = await Account.findById(accountId);

    if (!client || !account) {
      return res.json({ message: 'Account or client does not exist.' });
    }

    if (user) {
      const isUserAlreadyMemberOfClient = user.memberOfClients.some(clientId => clientId.toString() === clientId);
      const isUserAlreadyAdminOfClient = user.adminOfClients.some(clientId => clientId.toString() === clientId);

      if (isUserAlreadyMemberOfClient) {
        return res.json({ message: `${email} is already a member of ${client.name}` });
      } else if (isUserAlreadyAdminOfClient) {
        return res.json({ message: `${email} is already an administrator of ${client.name}` });
      }

      user.memberOfClients.push(clientId);
      user.memberOfAccounts.push(accountId);

      client.members.push(user._id);

      account.members.push(user._id);

      await user.save();
      await client.save();
      await account.save();

      //TODO enable account org branding in email
      await sendInvitationEmail(
        email.toLowerCase(),
        clientId,
        account.name,
        '../../email/templates/inviteNewUser.ejs'
      );

      return res.json({ success: true });
    } else {

    }

  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message
    });
  }
};

async function sendInvitationEmail(email, clientId, accountName, templateFile) {
  const qs = `email=${email}&clientId=${clientId}`;

  const verificationUrl = isDev ?
    `http://localhost:8080/api/acceptInvitation?${qs}` :
    `google.com`;

  const ejsData = {
    verificationUrl,
    accountName
  };

  const templatePath = path.resolve(__dirname, templateFile);
  const template = ejs.render(fs.readFileSync(templatePath, 'utf-8'), ejsData);

  await emailService.sendMail({
    from: 'Client Portal',
    to: email,
    subject: `Client Portal - Verify your Email`,
    text: template,
    html: template
  });
}