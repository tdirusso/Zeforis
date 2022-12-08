const nodemailer = require('nodemailer');

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  require('dotenv').config({
    path: __dirname + '/../.env.local'
  });
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'timgdirusso@gmail.com',
    pass: process.env.MAILER_PASSWORD
  }
});

module.exports = transporter;