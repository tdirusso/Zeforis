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
Object.defineProperty(exports, "__esModule", { value: true });
const web_api_1 = require("@slack/web-api");
const EnvVariable_1 = require("../types/EnvVariable");
class Slackbot {
    constructor() {
        this.client = new web_api_1.WebClient((0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.SLACK_BOT_OAUTH_TOKEN));
        this.channels = {
            errors: 'C05MNK33N7N',
            events: 'C05ML3A3DC3'
        };
    }
    post({ channel, message }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.chat.postMessage({
                text: message,
                channel
            });
        });
    }
}
exports.default = new Slackbot();
