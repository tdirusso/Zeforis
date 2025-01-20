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
    const { userId } = req.params;
    const userIdParam = Number(userId);
    const orgId = req.org.id;
    const updaterUserId = req.userId;
    if (!userIdParam || !orgId) {
        return res.json({
            message: 'Missing user deletion parameters.'
        });
    }
    if (updaterUserId === userIdParam) {
        return res.json({ message: 'You cannot remove yourself.' });
    }
    const connection = yield database_1.pool.getConnection();
    yield connection.beginTransaction();
    try {
        yield connection.query(`
        UPDATE tasks 
        SET assigned_to_id = NULL
        WHERE assigned_to_id = ? AND folder_id IN 
          (
            SELECT id FROM folders WHERE engagement_id IN 
            (SELECT id FROM engagements WHERE org_id = ?)
          )
      `, [userId, orgId]);
        yield connection.query(`DELETE FROM engagement_users WHERE user_id = ? AND engagement_id IN (SELECT id FROM engagements WHERE org_id = ?)`, [userId, orgId]);
        const orgOwnerPlan = yield database_1.commonQueries.getOrgOwnerPlan(connection, orgId);
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
