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
const Errors_1 = require("../../types/Errors");
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orgId } = req.params;
    const requestingUserId = req.userId;
    if (!orgId) {
        throw new Errors_1.BadRequestError('Missing required parameter [orgId].');
    }
    const connection = yield database_1.pool.getConnection();
    const [orgResult] = yield connection.query('SELECT owner_id FROM orgs WHERE id = ?', [orgId]);
    if (!orgResult.length) {
        throw new Errors_1.NotFoundError(`Org with ID ${orgId} was not found.`);
    }
    const org = orgResult[0];
    if (org.owner_id === requestingUserId) {
        const [engagementsResult] = yield connection.query(`SELECT 
      id,
      name, 
      org_id AS orgId, 
      date_created AS dateCreated,
      is_invite_link_enabled AS isInviteLinkEnabled,
      invite_link_hash AS inviteLinkHash,
      allowed_invite_domains AS allowedInviteDomains
      FROM engagements WHERE org_id = ? 
      ORDER BY name`, [orgId]);
        const engagements = engagementsResult.map((engagement) => {
            return Object.assign(Object.assign({}, engagement), { role: 'admin' });
        });
        connection.release();
        return res.json(engagements);
    }
    else {
        const [engagementsResult] = yield connection.query(`SELECT 
        id, 
        name,
        org_id as orgId, 
        date_created as dateCreated,
        engagement_users.role,
        is_invite_link_enabled AS isInviteLinkEnabled,
        invite_link_hash AS inviteLinkHash,
        allowed_invite_domains AS allowedInviteDomains
      FROM engagements 
      LEFT JOIN engagement_users ON engagements.id = engagement_users.engagement_id
      WHERE org_id = ? AND engagement_users.user_id = ?
      ORDER BY name`, [orgId, requestingUserId]);
        connection.release();
        return res.json(engagementsResult);
    }
});
