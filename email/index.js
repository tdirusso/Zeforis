const sgMail = require('@sendgrid/mail');
const { isDev } = require('../config');

class EmailService {
  constructor() {
    if (this.instance) {
      return this;
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    this.senders = {
      info: process.env.EMAIL_SENDER_INFO,
      support: process.env.EMAIL_SENDER_INFO,
      error: process.env.EMAIL_SENDER_ERROR
    };

    this.templates = {
      emailVerification: 'd-700a472b0af44176b3f18068e70363c0',
      passwordReset: 'd-c48f47ff6b0b4f8e874c07a4a8669e55',
      engagementInvitation: 'd-3070cc2e1f93499692376b90b4bbef04'
    };

    this.instance = this;
  }

  async sendEmail({ to, from, subject, text, html }) {
    await sgMail.send({ to, from, subject, text, html });
  }

  async sendEmailFromTemplate({ to, from, templateId, templateData }) {
    await sgMail.send({ to, from, templateId, dynamicTemplateData: templateData, hideWarnings: !isDev });
  }

  async sendMultipleEmailsFromTemplate(emailsArray) {
    await sgMail.send(emailsArray);

  }
}

const emailService = new EmailService();

module.exports = emailService;