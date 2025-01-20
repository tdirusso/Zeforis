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
const database_1 = require("../../database");
const utils_1 = require("../../lib/utils");
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, isAdmin = false } = req.body;
    if (!userId) {
        return res.json({
            message: 'Missing permissions parameters.'
        });
    }
    const orgId = req.org.id;
    const updaterUserId = req.userId;
    if (userId === updaterUserId) {
        return res.json({
            message: 'You cannot update your own permissions.'
        });
    }
    const connection = yield database_1.pool.getConnection();
    yield connection.beginTransaction();
    try {
        const orgOwnerPlan = yield database_1.commonQueries.getOrgOwnerPlan(connection, orgId);
        if (isAdmin && orgOwnerPlan === 'free') {
            return res.json({
                message: 'Cannot add more administrators.',
                uiProps: {
                    alertType: 'upgrade'
                }
            });
        }
        const [allOrgEngagementsResult] = yield connection.query('SELECT id FROM engagements WHERE org_id = ?', [orgId]);
        const newRole = isAdmin ? 'admin' : 'member';
        yield connection.query('UPDATE engagement_users SET role = ? WHERE engagement_id IN (?) AND user_id = ?', [newRole, allOrgEngagementsResult.map(({ id }) => id), userId]);
        if (orgOwnerPlan !== 'free') {
            const { success, message } = yield (0, utils_1.updateStripeSubscription)(connection, updaterUserId, orgId);
            if (!success) {
                yield connection.rollback();
                connection.release();
                return res.json({ message });
            }
        }
        yield connection.commit();
        connection.release();
        return res.json({ success: true });
    }
    catch (error) {
        yield connection.rollback();
        connection.release();
        next(error);
    }
});
