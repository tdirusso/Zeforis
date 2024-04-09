import sgMail from '@sendgrid/mail';
import { isDev } from '../config';
import { pool } from '../database';
import { EnvVariable, getEnvVariable } from '../types/EnvVariable';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { PoolConnection } from 'mysql2/promise';

const defaultEmailSender = getEnvVariable(EnvVariable.EMAIL_SENDER_INFO) || 'info@zeforis.com';

type EmailParameters = {
  to: string,
  from: string,
  subject: string,
  text: string,
  html: string;
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

  async sendLoginLinkEmail(email: string) {
    const loginCode = uuidv4().substring(0, 24);
    const _15minutesFromNow = moment().add(15, 'minutes');

    await pool.query('UPDATE users SET login_code = ?, login_code_expiration = ? WHERE email = ?',
      [loginCode, _15minutesFromNow.toDate(), email]
    );

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

  async sendInvitationEmails(engagementId: number, orgName: string, engagementName: string, orgColor: string, orgLogo: string | null, users: { email: string, role: 'admin' | 'member'; }[], connection: PoolConnection) {
    const invitationEmails: sgMail.MailDataRequired[] = [];
    const _3daysFromNow = moment().add(3, 'days').toDate();

    const insertInvitationValues = users.map(user => {
      const invitationCode = uuidv4().substring(0, 16);
      const emailAddress = user.email.toLowerCase();
      const role = user.role;

      const invitationUrl = `${getEnvVariable(EnvVariable.APP_DOMAIN)}/accept-invitation?engagementId=${engagementId}&email=${emailAddress}&invitationCode=${invitationCode}`;

      invitationEmails.push({
        to: emailAddress,
        from: this.senders.info,
        templateId: this.templates.engagementInvitation,
        dynamicTemplateData: {
          invitationUrl,
          orgName,
          engagementName,
          orgColor,
          orgLogo: orgLogo ? orgLogo : ''
        },
        hideWarnings: !isDev
      });

      return [
        engagementId,
        emailAddress,
        role,
        invitationCode,
        _3daysFromNow
      ];
    });

    await sgMail.send(invitationEmails);

    await connection.query(
      `INSERT INTO invitations (engagement_id, email, role, token, date_expires) 
        VALUES ?
        ON DUPLICATE KEY UPDATE role = VALUES(role), token = VALUES(token), date_expires = VALUES(date_expires)`,
      [insertInvitationValues]
    );
  }
}

export default new Emailer();

