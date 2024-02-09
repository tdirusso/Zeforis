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

class EmailService {
  instance = this;

  senders = {
    info: getEnvVariable(EnvVariable.EMAIL_SENDER_INFO) || defaultEmailSender,
    support: getEnvVariable(EnvVariable.EMAIL_SENDER_INFO) || defaultEmailSender,
    error: getEnvVariable(EnvVariable.EMAIL_SENDER_ERROR) || defaultEmailSender
  };

  templates = {
    emailVerification: 'd-700a472b0af44176b3f18068e70363c0',
    passwordReset: 'd-c48f47ff6b0b4f8e874c07a4a8669e55',
    engagementInvitation: 'd-3070cc2e1f93499692376b90b4bbef04'
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
}

export default new EmailService();

