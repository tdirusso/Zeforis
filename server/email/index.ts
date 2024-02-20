import sgMail from '@sendgrid/mail';
import { isDev } from '../config';
import { getEnvVariable, EnvVariable } from '../types/EnvVariable';

const defaultEmailSender = getEnvVariable(EnvVariable.EMAIL_SENDER_INFO) || 'info@zeforis.com';

type EmailParameters = {
  to: string,
  from: string,
  subject: string,
  text: string,
  html: string;
};

type EmailFromTemplateParameters = {
  to: string,
  from: string,
  templateId: string,
  templateData: {};
};

class Emailer {
  instance = this;

  senders = {
    info: getEnvVariable(EnvVariable.EMAIL_SENDER_INFO) || defaultEmailSender,
    support: getEnvVariable(EnvVariable.EMAIL_SENDER_INFO) || defaultEmailSender,
    error: getEnvVariable(EnvVariable.EMAIL_SENDER_ERROR) || defaultEmailSender
  };

  templates = {
    engagementInvitation: 'd-3070cc2e1f93499692376b90b4bbef04',
    loginLink: 'd-700a472b0af44176b3f18068e70363c0'
  };

  constructor() {
    sgMail.setApiKey(getEnvVariable(EnvVariable.SENDGRID_API_KEY));
  }

  async sendEmail({ to, from, subject, text, html }: EmailParameters) {
    await sgMail.send({ to, from, subject, text, html });
  }

  async sendEmailFromTemplate({ to, from, templateId, templateData }: EmailFromTemplateParameters) {
    await sgMail.send({ to, from, templateId, dynamicTemplateData: templateData, hideWarnings: !isDev });
  }

  async sendMultipleEmailsFromTemplate(emailsArray: sgMail.MailDataRequired | sgMail.MailDataRequired[]) {
    await sgMail.send(emailsArray);
  }

  async sendLoginLinkEmail(email: string, loginCode: string) {
    await sgMail.send({
      to: email,
      from: {
        email: this.senders.info,
        name: 'Zeforis'
      },
      templateId: this.templates.loginLink,
      dynamicTemplateData: {
        loginLinkUrl: `${getEnvVariable(EnvVariable.APP_DOMAIN)}/verify-login?loginCode=${loginCode}&email=${email}`
      },
      hideWarnings: true
    });
  }
}

export default new Emailer();

