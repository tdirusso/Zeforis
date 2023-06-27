const nodemailer = require('nodemailer');

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  require('dotenv').config({
    path: __dirname + '/../.env.local'
  });
}

console.log(process.env.MAILER_PASSWORD);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_USERNAME,
    pass: process.env.MAILER_PASSWORD
  }
});

module.exports = transporter;