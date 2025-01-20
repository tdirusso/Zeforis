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
const stripe_1 = __importDefault(require("../../stripe"));
const database_1 = require("../../database");
const config_1 = require("../../config");
const Errors_1 = require("../../types/Errors");
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { numAdmins } = req.body;
    const { org, userId } = req;
    if (!userId || !org) {
        return res.json({
            message: 'Missing user or org data.'
        });
    }
    const connection = yield database_1.pool.getConnection();
    const orgOwnerPlan = yield database_1.commonQueries.getOrgOwnerPlan(connection, org.id);
    if (orgOwnerPlan !== 'free') {
        return res.json({
            message: 'You are already on a paid Zeforis plan.  Please update the subscription instead.'
        });
    }
    if (!numAdmins || typeof numAdmins !== 'number' || numAdmins <= 0 || numAdmins >= 10000) {
        return res.json({
            message: 'Number of administrators is invalid.'
        });
    }
    try {
        const orgAdminsCount = yield database_1.commonQueries.getOrgAdminCount(database_1.pool, org.id);
        if (numAdmins < orgAdminsCount) {
            return res.json({
                message: `Number of admins must be >= ${orgAdminsCount}.  Received ${numAdmins}.`
            });
        }
        let customer = null;
        const [userResult] = yield database_1.pool.query('SELECT first_name AS firstName, last_name AS lastName, email FROM users WHERE id = ?', [userId]);
        if (!userResult.length) {
            throw new Errors_1.NotFoundError(`User with id ${userId} not found.`);
        }
        const user = userResult[0];
        const customers = yield stripe_1.default.customers.list({
            email: user.email,
            limit: 1
        });
        if (customers.data.length) {
            customer = customers.data[0];
        }
        else {
            const newCustomer = yield stripe_1.default.customers.create({
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                metadata: {
                    'Zeforis User ID': user.id,
                    'Organization ID': org.id,
                    'Organization Name': org.name
                }
            });
            yield database_1.pool.query('UPDATE users SET stripe_customerId = ? WHERE id = ?', [newCustomer.id, userId]);
            customer = newCustomer;
        }
        const existingSubscriptions = (yield stripe_1.default.subscriptions.list({
            customer: customer.id,
            limit: 100,
            expand: ['data.latest_invoice.payment_intent']
        })).data;
        if (existingSubscriptions.length) {
            for (const existingSubscription of existingSubscriptions) {
                if (existingSubscription.status === 'incomplete') {
                    const latestInvoice = existingSubscription.latest_invoice;
                    if (latestInvoice.payment_intent) {
                        const intent = latestInvoice.payment_intent;
                        return res.json({
                            clientSecret: intent.client_secret
                        });
                    }
                    else {
                        return res.json({ hasSubscription: true });
                    }
                }
            }
            return res.json({ hasSubscription: true });
        }
        const subscription = yield stripe_1.default.subscriptions.create({
            customer: customer.id,
            items: [{
                    price: config_1.stripeSubscriptionPriceId,
                    quantity: numAdmins
                }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
            proration_behavior: 'none'
        });
        const invoice = subscription.latest_invoice;
        const intent = invoice.payment_intent;
        return res.json({
            clientSecret: intent.client_secret
        });
    }
    catch (error) {
        next(error);
    }
});
