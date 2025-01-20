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
const google_auth_library_1 = require("google-auth-library");
const slackbot_1 = __importDefault(require("../../slackbot"));
const database_1 = require("../../database");
const utils_1 = require("../../lib/utils");
const Errors_1 = require("../../types/Errors");
const authClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, firstName, lastName, googleCredential } = req.body;
    const missingFields = (0, utils_1.getMissingFields)(['email', 'firstName', 'lastName'], req.body);
    if (missingFields.length > 0 && !googleCredential) {
        throw new Errors_1.BadRequestError(`Missing required parameters: [${missingFields.join(', ')}]`);
    }
    if (email && !email_validator_1.default.validate(email)) {
        throw new Errors_1.UnprocessableError('Invalid email format received.');
    }
    if (googleCredential) {
        const ticket = yield authClient.verifyIdToken({
            idToken: googleCredential,
            audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!(payload === null || payload === void 0 ? void 0 : payload.email)) {
            throw new Errors_1.BadRequestError('Missing email from googleCredential.');
        }
        const googleEmail = payload.email.toLowerCase();
        const [userResult] = yield database_1.pool.query('SELECT 1 FROM users WHERE email = ?', [googleEmail]);
        if (userResult.length) {
            throw new Errors_1.ConflictError(`Email ${googleEmail} already in use.`);
        }
        yield database_1.pool.query('INSERT INTO users (first_name, last_name, email) VALUES (?,?,?)', [payload.given_name, payload.family_name, googleEmail]);
        yield email_1.default.sendLoginLinkEmail(googleEmail);
        yield slackbot_1.default.post({
            channel: slackbot_1.default.channels.events,
            message: `*New User*\n${googleEmail}`
        });
        return res.sendStatus(204);
    }
    else {
        const lcEmail = email.toLowerCase();
        const [existsResult] = yield database_1.pool.query('SELECT 1 FROM users WHERE email = ?', [lcEmail]);
        if (existsResult.length) {
            throw new Errors_1.ConflictError(`Email ${email} is already in use.`);
        }
        yield database_1.pool.query('INSERT INTO users (first_name, last_name, email) VALUES (?,?,?)', [firstName, lastName, lcEmail]);
        yield email_1.default.sendLoginLinkEmail(lcEmail);
        yield slackbot_1.default.post({
            channel: slackbot_1.default.channels.events,
            message: `*New User*\n${lcEmail}`
        });
        return res.sendStatus(204);
    }
});
