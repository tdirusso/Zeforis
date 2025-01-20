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
    const { engagements = [] } = req.body;
    const { userId } = req.params;
    const updaterUserId = req.userId;
    const orgId = req.org.id;
    const userIdParam = Number(userId);
    if (!userIdParam || isNaN(userIdParam)) {
        return res.json({ message: 'Invalid userId parameter - must be an integer.' });
    }
    else if (!orgId) {
        return res.json({ message: 'Missing orgId parameter.' });
    }
    else if (engagements.length === 0) {
        return res.json({ message: 'engagements parameter is missing or empty.' });
    }
    const connection = yield database_1.pool.getConnection();
    try {
        const insertValues = [];
        const deleteValues = [];
        const paramErrors = [];
        const [orgUserExistsResult] = yield database_1.pool.query(`SELECT EXISTS(
        SELECT 1 FROM engagement_users 
        LEFT JOIN engagements ON engagement_users.engagement_id = engagements.id
        WHERE engagements.org_id = ? AND engagement_users.user_id = ?) 
        AS orgUserExists`, [orgId, userIdParam]);
        if (!orgUserExistsResult[0].orgUserExists) {
            connection.release();
            return res.json({ message: `userId ${userIdParam} does not exist in orgId ${orgId}` });
        }
        const [engagementsResult] = yield database_1.pool.query('SELECT id, org_id FROM engagements WHERE id IN (?)', [engagements.map(({ id }) => id)]);
        const engagementIdsMap = new Map(engagementsResult.map(({ id, org_id }) => [id, org_id]));
        engagements.forEach(({ id, hasAccess }, index) => {
            if (!id)
                paramErrors.push(`Missing id at index ${index}`);
            if (hasAccess === undefined)
                paramErrors.push(`Missing hasAccess at index ${index}`);
            if (hasAccess !== true && hasAccess !== false)
                paramErrors.push(`Invalid hasAccess value at index ${index} - expecting true or false`);
            if (engagementIdsMap.get(id) !== orgId)
                paramErrors.push(`engagementId ${id} does not belong to orgId ${orgId}`);
            if (hasAccess) {
                insertValues.push([id, userIdParam, 'member']);
            }
            else {
                deleteValues.push([id]);
            }
        });
        if (paramErrors.length) {
            return res.json({ message: 'engagements array contains errors.', errors: paramErrors });
        }
        yield connection.beginTransaction();
        if (insertValues.length) {
            yield connection.query('INSERT IGNORE INTO engagement_users (engagement_id, user_id, role) VALUES ?', [insertValues]);
        }
        if (deleteValues.length) {
            yield connection.query(`
          UPDATE tasks 
          SET assigned_to_id = NULL
          WHERE assigned_to_id = ? AND folder_id IN 
            (
              SELECT id FROM folders WHERE engagement_id IN 
              (SELECT id FROM engagements WHERE org_id = ?)
            )
        `, [userIdParam, orgId]);
            yield connection.query('DELETE FROM engagement_users WHERE engagement_id IN (?) AND user_id = ?', [deleteValues, userIdParam]);
            const orgOwnerPlan = yield database_1.commonQueries.getOrgOwnerPlan(connection, orgId);
            if (orgOwnerPlan !== 'free') {
                const { success, message } = yield (0, utils_1.updateStripeSubscription)(connection, updaterUserId, orgId);
                if (!success) {
                    yield connection.rollback();
                    connection.release();
                    return res.json({ message });
                }
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
