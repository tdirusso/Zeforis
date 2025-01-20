"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("@sendgrid/mail"));
const config_1 = require("../config");
const database_1 = require("../database");
const EnvVariable_1 = require("../types/EnvVariable");
const uuid_1 = require("uuid");
const moment_1 = __importDefault(require("moment"));
const defaultEmailSender = (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.EMAIL_SENDER_INFO) || 'info@zeforis.com';
class Emailer {
    constructor() {
        this.instance = this;
        this.senders = {
            info: (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.EMAIL_SENDER_INFO) || defaultEmailSender,
            support: (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.EMAIL_SENDER_INFO) || defaultEmailSender,
            error: (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.EMAIL_SENDER_ERROR) || defaultEmailSender
        };
        this.templates = {
            engagementInvitation: 'd-3070cc2e1f93499692376b90b4bbef04',
            loginLink: 'd-700a472b0af44176b3f18068e70363c0'
        };
        mail_1.default.setApiKey((0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.SENDGRID_API_KEY));
    }
    sendEmail({ to, from, subject, text, html }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mail_1.default.send({ to, from, subject, text, html });
        });
    }
    sendLoginLinkEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginCode = (0, uuid_1.v4)().substring(0, 24);
            const _15minutesFromNow = (0, moment_1.default)().add(15, 'minutes');
            yield database_1.pool.query('UPDATE users SET login_code = ?, login_code_expiration = ? WHERE email = ?', [loginCode, _15minutesFromNow.toDate(), email]);
            yield mail_1.default.send({
                to: email,
                from: {
                    email: this.senders.info,
                    name: 'Zeforis'
                },
                templateId: this.templates.loginLink,
                dynamicTemplateData: {
                    loginLinkUrl: `${(0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.APP_DOMAIN)}/verify-login?loginCode=${loginCode}&email=${email}`
                },
                hideWarnings: true
            });
        });
    }
    sendInvitationEmails(engagementId, orgName, engagementName, orgColor, orgLogo, users, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const invitationEmails = [];
            const _3daysFromNow = (0, moment_1.default)().add(3, 'days').toDate();
            const insertInvitationValues = users.map(user => {
                const invitationCode = (0, uuid_1.v4)().substring(0, 16);
                const emailAddress = user.email.toLowerCase();
                const role = user.role;
                const invitationUrl = `${(0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.APP_DOMAIN)}/accept-invitation?engagementId=${engagementId}&email=${emailAddress}&invitationCode=${invitationCode}`;
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
                    hideWarnings: !config_1.isDev
                });
                return [
                    engagementId,
                    emailAddress,
                    role,
                    invitationCode,
                    _3daysFromNow
                ];
            });
            yield mail_1.default.send(invitationEmails);
            yield connection.query(`INSERT INTO invitations (engagement_id, email, role, token, date_expires) 
        VALUES ?
        ON DUPLICATE KEY UPDATE role = VALUES(role), token = VALUES(token), date_expires = VALUES(date_expires)`, [insertInvitationValues]);
        });
    }
}
exports.default = new Emailer();
