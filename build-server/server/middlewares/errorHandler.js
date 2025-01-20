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
const jsonwebtoken_1 = require("jsonwebtoken");
const database_1 = require("../database");
const slackbot_1 = __importDefault(require("../slackbot"));
const config_1 = require("../config");
const Errors_1 = require("../types/Errors");
function errorHandler(error, _, res, __) {
    return __awaiter(this, void 0, void 0, function* () {
        if (error instanceof Errors_1.APIError) {
            const errorResponse = { message: error.message };
            if (error.errors) {
                errorResponse.errors = error.errors;
            }
            return res.status(error.statusCode).json(errorResponse);
        }
        else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            return res.status(400).json({ message: error.message });
        }
        else if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return res.status(401).json({ message: 'Session expired (token expired).' });
        }
        else if (error instanceof Error) {
            console.error('Application error:', error);
            yield handleServerError(error);
        }
        else {
            console.error('Non-Error object received:', error);
            yield handleNonError(error);
        }
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : null,
            message: 'Something went wrong...',
        });
    });
}
exports.default = errorHandler;
function handleServerError(error) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!config_1.isDev) {
                const stack = error.stack || 'No stack trace available';
                yield logToDatabase('handled-error', stack);
                yield notifyErrorToSlack('Server Error', stack);
            }
        }
        catch (newError) {
            console.error('Error handling error:', newError);
        }
    });
}
function handleNonError(error) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!config_1.isDev) {
                yield logToDatabase('handled-something', String(error));
                yield notifyErrorToSlack('Server Error (NOT instanceof Error)', String(error));
            }
        }
        catch (newError) {
            console.error('Error handling non-error:', newError);
        }
    });
}
function logToDatabase(type, data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.pool.query('INSERT INTO app_logs (type, data) VALUES (?, ?)', [type, data]);
    });
}
function notifyErrorToSlack(title, message) {
    return __awaiter(this, void 0, void 0, function* () {
        yield slackbot_1.default.post({
            channel: slackbot_1.default.channels.errors,
            message: `*${title}*\n${message}`
        });
    });
}
