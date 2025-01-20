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
const utils_1 = require("../lib/utils");
const Errors_1 = require("../types/Errors");
exports.default = (req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (0, utils_1.getAuthToken)(req);
    if (!token) {
        throw new Errors_1.UnauthorizedError(Errors_1.ErrorMessages.NoTokenProvided);
    }
    const orgId = (0, utils_1.getRequestParameter)('orgId', req);
    const engagementId = (0, utils_1.getRequestParameter)('engagementId', req);
    if (!orgId && !engagementId) {
        throw new Errors_1.BadRequestError('Missing required parameter [engagementId] or [orgId].');
    }
    const decoded = jsonwebtoken_1.default.verify(token, (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.SECRET_KEY));
    const userId = decoded.userId;
    if (userId) {
        let ownerOfOrgResult;
        if (engagementId) {
            [ownerOfOrgResult] = yield database_1.pool.query(`SELECT 
            orgs.id, 
            orgs.name, 
            orgs.brand_color AS brandColor,
            orgs.logo_url AS logo,
            engagements.name AS engagementName,
            engagements.is_invite_link_enabled AS isInviteLinkEnabled,
            engagements.invite_link_hash AS inviteLinkHash,
            engagements.allowed_invite_domains AS allowedInviteDomains
           FROM orgs
           LEFT JOIN engagements ON orgs.id = engagements.org_id
           WHERE engagements.id = ?
           AND orgs.owner_id = ?`, [engagementId, userId]);
        }
        else {
            [ownerOfOrgResult] = yield database_1.pool.query('SELECT id, name, brand_color AS brandColor, logo_url AS logo FROM orgs WHERE id = ? AND owner_id = ?', [orgId, userId]);
        }
        if (ownerOfOrgResult.length) {
            req.userId = userId;
            req.org = {
                id: ownerOfOrgResult[0].id,
                name: ownerOfOrgResult[0].name,
                brandColor: ownerOfOrgResult[0].brandColor,
                logo: ownerOfOrgResult[0].logo
            };
            if (engagementId) {
                req.engagement = {
                    id: Number(engagementId),
                    name: ownerOfOrgResult[0].engagementName,
                    isInviteLinkEnabled: ownerOfOrgResult[0].isInviteLinkEnabled,
                    inviteLinkHash: ownerOfOrgResult[0].inviteLinkHash
                };
            }
            return next();
        }
        else {
            throw new Errors_1.ForbiddenError(`Forbidden request.  Only the org owner can perform this operation.`);
        }
    }
    throw new Errors_1.BadRequestError(Errors_1.ErrorMessages.InvalidTokenBody);
});
