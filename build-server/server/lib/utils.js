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
exports.setAuthTokenCookie = exports.getRequestParameter = exports.getAuthToken = exports.wait = exports.getMissingFields = exports.updateStripeSubscription = exports.createJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const stripe_1 = __importDefault(require("../stripe"));
const database_1 = require("../database");
const EnvVariable_1 = require("../types/EnvVariable");
const config_1 = require("../config");
function createJWT(userId) {
    return jsonwebtoken_1.default.sign({ userId }, (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.SECRET_KEY), { expiresIn: 36000 });
}
exports.createJWT = createJWT;
function setAuthTokenCookie(token, res) {
    res.cookie('token', token, {
        httpOnly: true,
        secure: !config_1.isDev,
        sameSite: 'lax',
        maxAge: 36000000 // 10 hours
    });
}
exports.setAuthTokenCookie = setAuthTokenCookie;
function getAuthToken(req) {
    return req.cookies.token;
}
exports.getAuthToken = getAuthToken;
function getRequestParameter(parameterName, req) {
    let value;
    value = req.body[parameterName];
    if (!value) {
        value = req.query[parameterName];
    }
    if (!value) {
        value = req.params[parameterName];
    }
    return value;
}
exports.getRequestParameter = getRequestParameter;
function wait(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, ms));
    });
}
exports.wait = wait;
function updateStripeSubscription(con, userId, orgId) {
    return __awaiter(this, void 0, void 0, function* () {
        const [customerIdResult] = yield con.query('SELECT stripe_customerId FROM users WHERE id = ?', [userId]);
        const customerId = customerIdResult[0].stripe_customerId;
        if (!customerId) {
            return { message: 'No customerId was found.' };
        }
        const subscriptions = (yield stripe_1.default.subscriptions.list({
            customer: customerId
        })).data;
        const activeSubscription = subscriptions.find(sub => sub.status === 'active');
        const pastDueSubscription = subscriptions.find(sub => sub.status === 'past_due');
        if (!activeSubscription) {
            if (pastDueSubscription) {
                return { message: 'Your subscription is past due.  Please update your subscription from account settings and try again.' };
            }
            else {
                return { message: 'No active subscription was found.  You can manage/create a subscription from account settings.' };
            }
        }
        const orgAdminCount = yield database_1.commonQueries.getOrgAdminCount(con, orgId);
        yield stripe_1.default.subscriptions.update(activeSubscription.id, {
            proration_behavior: 'none',
            items: [
                {
                    id: activeSubscription.items.data[0].id,
                    quantity: orgAdminCount
                },
            ],
        });
        return { success: true };
    });
}
exports.updateStripeSubscription = updateStripeSubscription;
const frontendFieldMappings = {
    email: 'Email',
    firstName: 'First name',
    lastName: 'Last name',
};
const getMissingFields = (requiredFields, requestBody, useFrontEndMappings = false) => {
    const missingFields = [];
    for (const field of requiredFields) {
        if (!requestBody[field]) {
            missingFields.push(useFrontEndMappings ? frontendFieldMappings[field] : field);
        }
    }
    return missingFields;
};
exports.getMissingFields = getMissingFields;
