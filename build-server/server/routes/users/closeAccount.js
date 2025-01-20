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
const stripe_1 = __importDefault(require("../../stripe"));
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    if (!userId) {
        return res.json({
            message: 'Missing userId.'
        });
    }
    try {
        const [stripeCustomerIdResult] = yield database_1.pool.query('SELECT stripe_customerId FROM users WHERE id = ?', [userId]);
        const customerId = stripeCustomerIdResult[0].stripe_customerId;
        if (customerId) {
            const subscriptions = (yield stripe_1.default.subscriptions.list({
                customer: customerId
            })).data;
            const subscription = subscriptions.find(sub => sub.status === 'active' || sub.status === 'past_due');
            if (subscription) {
                yield stripe_1.default.subscriptions.cancel(subscription.id, {
                    cancellation_details: {
                        comment: 'Canceled due to account closure.'
                    },
                    prorate: false
                });
            }
        }
        yield database_1.pool.query('DELETE FROM users WHERE id = ?', [userId]);
        return res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
