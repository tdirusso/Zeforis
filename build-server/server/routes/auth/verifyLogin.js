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
const utils_1 = require("../../lib/utils");
const moment_1 = __importDefault(require("moment"));
const Errors_1 = require("../../types/Errors");
const email_validator_1 = __importDefault(require("email-validator"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, loginCode } = req.body;
    yield (0, utils_1.wait)(1500);
    if (!email || !loginCode) {
        throw new Errors_1.BadRequestError('Missing required parameter [email].');
    }
    if (!loginCode) {
        throw new Errors_1.BadRequestError('Missing login code.');
    }
    if (!email_validator_1.default.validate(email)) {
        throw new Errors_1.BadRequestError(`Invalid email address format received:  ${email}.`);
    }
    const connection = yield database_1.pool.getConnection();
    const lowercaseEmail = email.toLowerCase();
    const [userResult] = yield connection.query(`SELECT id, login_code, login_code_expiration FROM users WHERE email = ?`, [lowercaseEmail]);
    const user = userResult[0];
    if (!user) {
        connection.release();
        throw new Errors_1.NotFoundError(`User with email ${lowercaseEmail} does not exist.`);
    }
    if (!user.login_code || user.login_code !== loginCode) {
        connection.release();
        throw new Errors_1.UnauthorizedError('Invalid login code received.');
    }
    const now = (0, moment_1.default)();
    const loginCodeExpiration = (0, moment_1.default)(user.login_code_expiration);
    if (loginCodeExpiration.isBefore(now)) {
        connection.release();
        throw new Errors_1.UnauthorizedError('Login code expired.');
    }
    yield connection.query('UPDATE users SET login_code = NULL, login_code_expiration = NULL WHERE id = ?', [user.id]);
    const token = (0, utils_1.createJWT)(user.id);
    (0, utils_1.setAuthTokenCookie)(token, res);
    return res.sendStatus(200);
});
