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
const database_1 = require("../database");
const stripe_1 = __importDefault(require("../stripe"));
const slackbot_1 = __importDefault(require("../slackbot"));
const cache_1 = __importDefault(require("../cache"));
const config_1 = require("../config");
const EnvVariable_1 = require("../types/EnvVariable");
const webhookSecret = (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.STRIPE_WEBHOOK_SECRET);
if (!webhookSecret) {
    throw new Error(`Environment variable missing:  ${EnvVariable_1.EnvVariable.STRIPE_WEBHOOK_SECRET}`);
}
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let event = req.body;
    const signature = req.headers['stripe-signature'];
    if (!signature) {
        return res.status(401).json({ message: 'Unauthorized request - missing required header:  "stripe-signature"' });
    }
    try {
        event = stripe_1.default.webhooks.constructEvent(req.body, signature, webhookSecret);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(`Stripe webhook signature verification failed - `, error.message);
        }
        return res.status(400).json({ message: 'Stripe webhook signature verification failed.' });
    }
    try {
        switch (event.type) {
            case 'customer.subscription.deleted': {
                const { customer, plan, quantity } = event.data.object;
                if (customer) {
                    const [userResult] = yield database_1.pool.query('SELECT id, email FROM users WHERE stripe_customerId = ?', [customer]);
                    const user = userResult[0];
                    if (user) {
                        yield database_1.pool.query('UPDATE users SET stripe_subscription_status = "canceled", plan = "free" WHERE id = ?', [user.id]);
                        const [ownedOrgs] = yield database_1.pool.query('SELECT id FROM orgs WHERE owner_id = ?', [user.id]);
                        ownedOrgs.forEach(({ id }) => {
                            let cachedOrgData = cache_1.default.get(`org-${id}`);
                            if (cachedOrgData) {
                                cache_1.default.set(`org-${id}`, Object.assign(Object.assign({}, cachedOrgData), { ownerPlan: 'free' }));
                            }
                        });
                        yield slackbot_1.default.post({
                            channel: slackbot_1.default.channels.events,
                            message: `*Subscription Canceled* 😢\n*Amount:*  -${((plan.amount * quantity) / 100).toLocaleString('en', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}\n*Email:*  ${user.email}`
                        });
                    }
                }
                break;
            }
            case 'customer.subscription.updated': {
                const { customer, status, quantity } = event.data.object;
                const { previous_attributes } = event.data;
                if (status === 'past_due' && customer) {
                    const [userResult] = yield database_1.pool.query('SELECT id, email FROM users WHERE stripe_customerId = ?', [customer]);
                    const user = userResult[0];
                    if (user) {
                        yield database_1.pool.query('UPDATE users SET stripe_subscription_status = "past_due" WHERE id = ?', [user.id]);
                        yield slackbot_1.default.post({
                            channel: slackbot_1.default.channels.events,
                            message: `*Subscription Past Due* 😧\n*Email:*  ${user.email}`
                        });
                    }
                }
                else if (previous_attributes && previous_attributes.quantity) {
                    const prevQuantity = previous_attributes.quantity;
                    if (prevQuantity !== quantity) {
                        const [userResult] = yield database_1.pool.query('SELECT email FROM users WHERE stripe_customerId = ?', [customer]);
                        const user = userResult[0];
                        if (user) {
                            if (prevQuantity < quantity) {
                                yield slackbot_1.default.post({
                                    channel: slackbot_1.default.channels.events,
                                    message: `*Subscription Updated - ${quantity - prevQuantity} Administrators Added* 🤑\n*Amount:*  ${(prevQuantity * config_1.pricePerAdminMonthly).toLocaleString('en', {
                                        style: 'currency',
                                        currency: 'USD',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })} ---> ${(quantity * config_1.pricePerAdminMonthly).toLocaleString('en', {
                                        style: 'currency',
                                        currency: 'USD',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}\n*Email:*  ${user.email}`
                                });
                            }
                            else if (prevQuantity > quantity) {
                                yield slackbot_1.default.post({
                                    channel: slackbot_1.default.channels.events,
                                    message: `*Subscription Updated - ${prevQuantity - quantity} Administrators Removed* 😢\n*Amount:*  ${(prevQuantity * config_1.pricePerAdminMonthly).toLocaleString('en', {
                                        style: 'currency',
                                        currency: 'USD',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })} ---> ${(quantity * config_1.pricePerAdminMonthly).toLocaleString('en', {
                                        style: 'currency',
                                        currency: 'USD',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}\n*Email:*  ${user.email}`
                                });
                            }
                        }
                    }
                }
                break;
            }
            case 'invoice.paid':
                {
                    const { customer, amount_paid } = event.data.object;
                    if (customer) {
                        const [userResult] = yield database_1.pool.query('SELECT id, email FROM users WHERE stripe_customerId = ?', [customer]);
                        const user = userResult[0];
                        if (user) {
                            yield database_1.pool.query('UPDATE users SET stripe_subscription_status = "active", plan = "pro" WHERE id = ?', [user.id]);
                            const [ownedOrgs] = yield database_1.pool.query('SELECT id FROM orgs WHERE owner_id = ?', [user.id]);
                            ownedOrgs.forEach(({ id }) => {
                                let cachedOrgData = cache_1.default.get(`org-${id}`);
                                if (cachedOrgData) {
                                    cache_1.default.set(`org-${id}`, Object.assign(Object.assign({}, cachedOrgData), { ownerPlan: 'pro' }));
                                }
                            });
                            yield slackbot_1.default.post({
                                channel: slackbot_1.default.channels.events,
                                message: `*New Subscription Payment* 🤑\n*Amount:*  ${(amount_paid / 100).toLocaleString('en', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}\n*Email:*  ${user.email}`
                            });
                        }
                    }
                    break;
                }
            default:
                break;
        }
        return res.send();
    }
    catch (error) {
        next(error);
        return res.sendStatus(400);
    }
});
