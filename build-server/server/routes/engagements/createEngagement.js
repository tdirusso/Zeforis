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
    var _a;
    const { name } = req.body;
    const requestingUserId = req.userId;
    const orgId = (_a = req.org) === null || _a === void 0 ? void 0 : _a.id;
    if (!name) {
        return res.json({
            message: 'Missing engagement name.'
        });
    }
    if (!orgId) {
        return res.json({
            message: 'Missing orgId.'
        });
    }
    if (!requestingUserId) {
        return res.json({
            message: 'Missing user.'
        });
    }
    const connection = yield database_1.pool.getConnection();
    try {
        const orgOwnerPlan = yield database_1.commonQueries.getOrgOwnerPlan(connection, orgId);
        if (orgOwnerPlan === 'free') {
            const [engagementCountResult] = yield connection.query('SELECT EXISTS(SELECT id FROM engagements WHERE org_id = ?) as engagementExists', [orgId]);
            if (engagementCountResult[0].engagementExists) {
                return res.json({ message: 'Upgrade to Zeforis Pro to create multiple engagements.' });
            }
        }
        const newEngagement = yield connection.query('INSERT INTO engagements (name, org_id) VALUES (?,?)', [name, orgId]);
        const newEngagementId = newEngagement[0].insertId;
        yield connection.query('INSERT INTO engagement_users (engagement_id, user_id, role) VALUES (?,?, "admin")', [newEngagementId, requestingUserId]);
        const engagementObject = {
            id: newEngagementId,
            name,
            orgId
        };
        connection.release();
        return res.json({ engagement: engagementObject });
    }
    catch (error) {
        connection.release();
        next(error);
    }
});
