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
const database_1 = require("../../database");
const google_auth_library_1 = require("google-auth-library");
const slackbot_1 = __importDefault(require("../../slackbot"));
const utils_1 = require("../../lib/utils");
const EnvVariable_1 = require("../../types/EnvVariable");
const Errors_1 = require("../../types/Errors");
const email_1 = __importDefault(require("../../email"));
const authClient = new google_auth_library_1.OAuth2Client((0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.GOOGLE_OAUTH_CLIENT_ID));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isFromCustomLoginPage } = req.body;
    yield (0, utils_1.wait)(1500);
    if (isFromCustomLoginPage) {
        yield handleCustomPageLogin(req, res);
    }
    else {
        yield handleUniversalLogin(req, res);
    }
});
function handleCustomPageLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, googleCredential, orgId } = req.body;
        if ((!email) && !googleCredential) {
            throw new Errors_1.BadRequestError('Missing credentials, please try again.');
        }
        if (googleCredential) {
            const ticket = yield authClient.verifyIdToken({
                idToken: googleCredential,
                audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!(payload === null || payload === void 0 ? void 0 : payload.email)) {
                throw new Errors_1.BadRequestError('Email is missing from Google Credential.');
            }
            const googleEmail = payload.email.toLowerCase();
            const [userResult] = yield database_1.pool.query(`
        SELECT 
          id
          FROM users WHERE email = ? 
          AND EXISTS
          (
            SELECT 1 FROM engagement_users 
            JOIN engagements ON engagements.id = engagement_users.engagement_id
            JOIN users ON users.id = engagement_users.user_id
            WHERE engagements.org_id = ? and users.email = ?
          )
        `, [googleEmail, orgId, googleEmail]);
            if (!userResult.length) {
                throw new Errors_1.ForbiddenError('You are not a member of this organization.');
            }
            const token = (0, utils_1.createJWT)(userResult[0].id);
            (0, utils_1.setAuthTokenCookie)(token, res);
            return res.sendStatus(202);
        }
        else {
            const lcEmail = email.toLowerCase();
            const [userResult] = yield database_1.pool.query(`
        SELECT 
          id
          FROM users WHERE email = ? 
          AND EXISTS
          (
            SELECT 1 FROM engagement_users 
            JOIN engagements ON engagements.id = engagement_users.engagement_id
            JOIN users ON users.id = engagement_users.user_id
            WHERE engagements.org_id = ? and users.email = ?
          )
        `, [lcEmail, orgId, lcEmail]);
            if (userResult.length) {
                yield email_1.default.sendLoginLinkEmail(userResult[0].email);
                return res.sendStatus(202);
            }
            else {
                throw new Errors_1.ForbiddenError('You are not a member of this organization.');
            }
        }
    });
}
function handleUniversalLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, googleCredential } = req.body;
        if ((!email) && !googleCredential) {
            throw new Errors_1.BadRequestError('No email or Google Credential was provided.');
        }
        if (googleCredential) {
            const ticket = yield authClient.verifyIdToken({
                idToken: googleCredential,
                audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!(payload === null || payload === void 0 ? void 0 : payload.email)) {
                throw new Errors_1.BadRequestError('Email is missing from Google Credential.');
            }
            const googleEmail = payload.email.toLowerCase();
            const [userResult] = yield database_1.pool.query('SELECT id FROM users WHERE email = ?', [googleEmail]);
            if (userResult.length) {
                const token = (0, utils_1.createJWT)(userResult[0].id);
                (0, utils_1.setAuthTokenCookie)(token, res);
                return res.sendStatus(202);
            }
            else {
                const createUserResult = yield database_1.pool.query('INSERT INTO users (first_name, last_name, email) VALUES (?,?,?)', [payload.given_name, payload.family_name, googleEmail]);
                yield slackbot_1.default.post({
                    channel: slackbot_1.default.channels.events,
                    message: `*New User*\n${googleEmail}`
                });
                const token = (0, utils_1.createJWT)(createUserResult[0].insertId);
                (0, utils_1.setAuthTokenCookie)(token, res);
                return res.sendStatus(202);
            }
        }
        else {
            const lcEmail = email.toLowerCase();
            const [userResult] = yield database_1.pool.query('SELECT email FROM users WHERE email = ?', [lcEmail]);
            if (userResult.length) {
                yield email_1.default.sendLoginLinkEmail(userResult[0].email);
                return res.sendStatus(202);
            }
            else {
                throw new Errors_1.NotFoundError(`No account was found with email ${lcEmail}.`);
            }
        }
    });
}
