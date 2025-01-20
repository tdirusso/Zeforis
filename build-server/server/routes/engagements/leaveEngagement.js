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
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { orgId, engagement: { id: engagementId }, } = req.body;
    if (!engagementId || !orgId) {
        return res.json({
            message: 'Missing engagementId or orgId.'
        });
    }
    const userId = req.userId;
    try {
        const [isUserOwnerOfOrgResult] = yield database_1.pool.query('SELECT 1 FROM orgs WHERE id = ? AND owner_id = ?', [orgId, userId]);
        if (isUserOwnerOfOrgResult.length) {
            return res.json({
                message: 'As the org owner, you may only delete the engagement.'
            });
        }
        yield database_1.pool.query(`
        UPDATE tasks 
        SET assigned_to_id = NULL
        WHERE assigned_to_id = ? AND folder_id IN 
          (
            SELECT id FROM folders WHERE engagement_id = ?
          )
      `, [userId, engagementId]);
        yield database_1.pool.query('DELETE FROM engagement_users WHERE user_id = ? AND engagement_ID = ?', [userId, engagementId]);
        return res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
