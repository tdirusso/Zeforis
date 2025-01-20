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
const utils_1 = require("../../lib/utils");
const Errors_1 = require("../../types/Errors");
const moment_1 = __importDefault(require("moment"));
const validRoles = new Set(['admin', 'member']);
const validRolesString = `[${Array.from(validRoles).join(', ')}]`;
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { users = [] } = req.body;
    const { engagementId } = req.params;
    const { id: orgId, name: orgName, logo: orgLogo, brandColor: orgColor } = req.org;
    const requestingUserId = req.userId;
    if (!engagementId) {
        throw new Errors_1.BadRequestError('Missing required parameter /{engagementId}/.');
    }
    if (!users.length) {
        throw new Errors_1.BadRequestError(`[users] is empty.`);
    }
    if (users.length >= 20) {
        throw new Errors_1.BadRequestError('[users] must contain less than 20 entries.');
    }
    const connection = yield database_1.pool.getConnection();
    const [requestingUserResult] = yield connection.query('SELECT email FROM users WHERE id = ?', [requestingUserId]);
    const containsSelf = users.some(user => { var _a; return ((_a = user.email) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === requestingUserResult[0].email; });
    if (containsSelf) {
        throw new Errors_1.BadRequestError(`Cannot invite yourself (${requestingUserResult[0].email})`);
    }
    const hasAdmins = users.some(user => user.role === 'admin');
    if (hasAdmins) {
        const orgOwnerPlan = yield database_1.commonQueries.getOrgOwnerPlan(connection, orgId);
        if (orgOwnerPlan === 'free') {
            throw new Errors_1.ForbiddenError('Cannot add administrators - upgrade required.');
        }
    }
    const invalidOrMissingFields = [];
    const allEmails = [];
    const emailSet = new Set();
    users.forEach((user, index) => {
        var _a;
        const email = (_a = user.email) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        const role = user.role;
        if (!email || !email_validator_1.default.validate(email)) {
            invalidOrMissingFields.push(`Invalid/missing email at index ${index}: ${email}`);
        }
        else if (!role || !validRoles.has(role)) {
            invalidOrMissingFields.push(`Invalid/missing role at index ${index}:  ${role}.   Valid values are:  ${validRolesString}`);
        }
        else if (emailSet.has(email)) {
            invalidOrMissingFields.push(`Duplicate email at index ${index}: ${email}`);
        }
        else {
            allEmails.push(email);
            emailSet.add(email);
        }
    });
    if (invalidOrMissingFields.length) {
        throw new Errors_1.BadRequestError(`Received errors for [users].`, invalidOrMissingFields);
    }
    const [engagementResult] = yield connection.query('SELECT name FROM engagements WHERE id = ?', [engagementId]);
    if (!engagementResult.length) {
        throw new Errors_1.NotFoundError(`Engagement with id ${engagementId} not found.`);
    }
    const [existingEngagementUsersResult] = yield connection.query(`
    SELECT users.email 
    FROM engagement_users
    LEFT JOIN users ON users.id = engagement_users.user_id
    WHERE 
    engagement_id = ? 
    AND users.email IN (?)`, [engagementId, allEmails]);
    if (existingEngagementUsersResult.length) {
        throw new Errors_1.ConflictError(`The following users are already members of this engagement:  ${existingEngagementUsersResult.map(user => user.email).join(', ')}`);
    }
    yield connection.beginTransaction();
    try {
        const [existingUsersResult] = yield connection.query('SELECT email FROM users WHERE email IN (?)', [allEmails]);
        const existingUsersEmails = existingUsersResult.map(user => user.email);
        const newEmails = allEmails.filter(email => !existingUsersEmails.includes(email));
        if (newEmails.length) {
            yield connection.query('INSERT INTO users (email) VALUES ?', [newEmails.map(email => [email])]);
        }
        yield email_1.default.sendInvitationEmails(Number(engagementId), orgName, engagementResult[0].name, orgColor, orgLogo || null, users, connection);
        if (hasAdmins) {
            const { success, message } = yield (0, utils_1.updateStripeSubscription)(connection, requestingUserId, orgId);
            if (!success) {
                yield connection.rollback();
                connection.release();
                throw new Errors_1.ServerError(message || 'Error while updating your subscription.');
            }
        }
        yield connection.commit();
        connection.release();
        const now = new Date().toISOString();
        const _3daysFromNow = (0, moment_1.default)().add(3, 'days').toISOString();
        return res.status(201).json(users.map(user => {
            return {
                email: user.email.toLowerCase(),
                isAccepted: false,
                engagementId: Number(engagementId),
                dateCreated: now,
                dateExpires: _3daysFromNow,
                role: user.role
            };
        }));
    }
    catch (error) {
        yield connection.rollback();
        connection.release();
        next(error);
    }
});
