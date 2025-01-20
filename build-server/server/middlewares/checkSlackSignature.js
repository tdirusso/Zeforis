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
const crypto_1 = __importDefault(require("crypto"));
const EnvVariable_1 = require("../types/EnvVariable");
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const slackSignature = req.headers['x-slack-signature'];
    const slackTimestamp = req.headers['x-slack-request-timestamp'];
    const rawBody = req.rawBody;
    if (!slackSignature || !slackTimestamp || !rawBody) {
        return res.json({
            message: 'Unauthorized request.'
        });
    }
    try {
        const rawBodyString = Buffer.from(rawBody).toString();
        const signatureBase = `v0:${slackTimestamp}:${rawBodyString}`;
        const computedHash = crypto_1.default
            .createHmac('sha256', (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.SLACK_SIGNING_SECRET))
            .update(signatureBase)
            .digest('hex');
        if (`v0=${computedHash}` === slackSignature) {
            return next();
        }
        return res.json({
            message: 'Unauthorized request.'
        });
    }
    catch (error) {
        next(error);
    }
});
