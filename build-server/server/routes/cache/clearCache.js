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
const cache_1 = __importDefault(require("../../cache"));
const EnvVariable_1 = require("../../types/EnvVariable");
const appSecret = (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.SECRET_KEY);
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { apiKey } = req.query;
    if (!apiKey || apiKey !== appSecret) {
        return res.json({
            message: 'Invalid API key.'
        });
    }
    cache_1.default.clear();
    return res.json({
        success: true
    });
});
