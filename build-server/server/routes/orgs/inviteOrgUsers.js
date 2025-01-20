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
const email_1 = __importDefault(require("../../email"));
const email_validator_1 = __importDefault(require("email-validator"));
const database_1 = require("../../database");
const uuid_1 = require("uuid");
const config_1 = require("../../config");
const utils_1 = require("../../lib/utils");
const EnvVariable_1 = require("../../types/EnvVariable");
const appDomain = (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.APP_DOMAIN);
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { usersToInvite = [], engagementId, engagementName, orgName, inviteType = 'member', orgColor = '#3365f6', orgLogo } = req.body;
    const updaterUserId = req.userId;
    const orgId = req.org.id;
    if (!engagementId || !orgId) {
        return res.json({
            message: 'Missing engagementId or orgId.'
        });
    }
    if (!usersToInvite.length) {
        return res.json({
            message: 'Missing users to invite.'
        });
    }
    if (usersToInvite.length >= 100) {
        return res.json({ message: 'Too many users to invite (must be less than 100).' });
    }
    const invalidOrMissingEmails = [];
    const allEmailsArray = [];
    let countNewEmails = 0;
    usersToInvite.forEach((user) => {
        var _a;
        const email = (_a = user.email) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (!email || !email_validator_1.default.validate(email)) {
            invalidOrMissingEmails.push(user);
        }
        else {
            if (!user.id) {
                countNewEmails++;
            }
            allEmailsArray.push(email);
        }
    });
    if (invalidOrMissingEmails.length) {
        return res.json({ message: `Invalid emails provided for the following users:  ${JSON.stringify(invalidOrMissingEmails)}` });
    }
    if (countNewEmails > 567) {
        return res.json({ message: `New emails to invite cannot exceed ${567} - found ${countNewEmails}.` });
    }
    if (!allEmailsArray.length) {
        return res.json({ message: 'Did not find any valid emails to invite.' });
    }
    const connection = yield database_1.pool.getConnection();
    yield connection.beginTransaction();
    try {
        const orgOwnerPlan = yield database_1.commonQueries.getOrgOwnerPlan(connection, orgId);
        if (orgOwnerPlan === 'free' && inviteType === 'admin') {
            return res.json({ message: 'Upgrade to Zeforis Pro to add administrators.' });
        }
        const [allExistingUsers] = yield connection.query('SELECT id, email, first_name, last_name FROM users WHERE email IN (?) AND id != ?', [allEmailsArray, updaterUserId]);
        const allEmailsToUserMap = {};
        const existingUsersEmails = allExistingUsers.map(user => {
            allEmailsToUserMap[user.email] = {
                id: user.id,
                isNew: false,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email
            };
            return user.email;
        });
        const newEmails = allEmailsArray.filter(email => !existingUsersEmails.includes(email));
        if (newEmails.length) {
            const [newUsersResult] = yield connection.query('INSERT INTO users (email) VALUES ?', [newEmails.map(email => [email])]);
            let insertId = newUsersResult.insertId;
            newEmails.forEach(email => allEmailsToUserMap[email] = {
                id: insertId++,
                isNew: true,
                firstName: '',
                lastName: '',
                email
            });
        }
        const invitationEmails = [];
        const insertEngagementUsersValues = allEmailsArray.map(email => {
            const userDetails = allEmailsToUserMap[email];
            const userId = userDetails.id;
            const needsInvitationCode = userDetails.isNew;
            const invitationCode = needsInvitationCode ? (0, uuid_1.v4)().substring(0, 16) : null;
            const role = inviteType === 'admin' ? 'admin' : 'member';
            const invitationUrl = needsInvitationCode ?
                `${appDomain}/accept-invitation?engagementId=${engagementId}&userId=${userId}&invitationCode=${invitationCode}&orgId=${orgId}` :
                `${appDomain}/login?cp=${Buffer.from(`orgId=${orgId}`).toString('base64')}&engagementId=${engagementId}`;
            invitationEmails.push({
                to: email,
                from: email_1.default.senders.info,
                templateId: email_1.default.templates.engagementInvitation,
                dynamicTemplateData: {
                    invitationUrl,
                    orgName,
                    engagementName,
                    orgColor,
                    orgLogo
                },
                hideWarnings: !config_1.isDev
            });
            return [
                engagementId,
                userId,
                role,
                invitationCode
            ];
        });
        yield connection.query(`INSERT INTO engagement_users (engagement_id, user_id, role, invitation_code) 
        VALUES ?
        ON DUPLICATE KEY UPDATE role = VALUES(role), invitation_code = VALUES(invitation_code)`, [insertEngagementUsersValues]);
        if (inviteType === 'admin') {
            const { success, message } = yield (0, utils_1.updateStripeSubscription)(connection, updaterUserId, orgId);
            if (!success) {
                yield connection.rollback();
                connection.release();
                return res.json({ message });
            }
        }
        yield connection.commit();
        connection.release();
        return res.json({
            success: true,
            invitedUsers: Object.values(allEmailsToUserMap)
        });
    }
    catch (error) {
        yield connection.rollback();
        connection.release();
        next(error);
    }
});
