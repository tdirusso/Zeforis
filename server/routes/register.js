const bcrypt = require('bcrypt');
const User = require('../../models/user');
const Account = require('../../models/account');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const emailService = require('../../email');

const isDev = process.env.NODE_ENV === 'development';

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

  try {
    const userExists = await User.exists({ email });

    if (userExists) {
      return res.json({
        message: `"${email}" is already in use.  Please sign in instead.`
      });
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 10),
      verificationCode
    });

    const account = await Account.create({
      name: orgName,
      createdBy: newUser._id
    });

    newUser.memberOfAccounts = [account._id];
    await newUser.save();

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

  const verificationUrl = isDev ?
    `http://localhost:8080/api/verify?${qs}` :
    `google.com`;

  const ejsData = {
    verificationUrl
  };

  const templatePath = path.resolve(__dirname, '../../email/templates/verifyEmail.ejs');
  const template = ejs.render(fs.readFileSync(templatePath, 'utf-8'), ejsData);

  await emailService.sendMail({
    from: 'Client Portal',
    to: email,
    subject: `Client Portal - Verify your Email`,
    text: template,
    html: template
  });
}