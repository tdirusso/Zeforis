"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const EnvVariable_1 = require("../types/EnvVariable");
const stripeSecretKey = (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.STRIPE_SECRET_KEY);
exports.default = new stripe_1.default(stripeSecretKey, { apiVersion: '2023-08-16' });
