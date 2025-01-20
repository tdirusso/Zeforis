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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database");
const EnvVariable_1 = require("../types/EnvVariable");
const Errors_1 = require("../types/Errors");
const utils_1 = require("../lib/utils");
exports.default = (req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (0, utils_1.getAuthToken)(req);
    if (!token) {
        throw new Errors_1.UnauthorizedError(Errors_1.ErrorMessages.NoTokenProvided);
    }
    const engagementId = (0, utils_1.getRequestParameter)('engagementId', req);
    if (!engagementId) {
        throw new Errors_1.BadRequestError('Missing required parameter /{engagementId}/.');
    }
    const decoded = jsonwebtoken_1.default.verify(token, (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.SECRET_KEY));
    const userId = decoded.userId;
    const [checkResult] = yield database_1.pool.query(`
    SELECT 
      engagements.org_id AS orgId,
      engagements.name,
      engagements.is_invite_link_enabled AS isInviteLinkEnabled,
      engagements.invite_link_hash AS inviteLinkHash,
      engagements.allowed_invite_domains AS allowedInviteDomains,
      orgs.owner_id AS orgOwnerId,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM engagement_users 
            WHERE engagement_id = ? AND user_id = ?
        ) THEN 1 
        ELSE 0 
    END AS engagementUserExists
    FROM engagements
    LEFT JOIN orgs ON orgs.id = engagements.org_id
    WHERE engagements.id = ?`, [userId, engagementId, engagementId]);
    if (!checkResult.length) {
        throw new Errors_1.NotFoundError(`Engagement with id ${engagementId} not found.`);
    }
    const { orgId, orgOwnerId, engagementUserExists, } = checkResult[0];
    if (orgOwnerId === userId || engagementUserExists) {
        req.userId = userId;
        req.orgId = orgId;
        req.engagement = {
            id: Number(engagementId),
            name: checkResult[0].name,
            inviteLinkHash: checkResult[0].inviteLinkHash,
            isInviteLinkEnabled: checkResult[0].isInviteLinkEnabled,
            allowedInviteDomains: checkResult[0].allowedInviteDomains
        };
        return next();
    }
    throw new Errors_1.ForbiddenError(`You are not authorized to access engagement with id ${engagementId}.`);
});
