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
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (0, utils_1.getAuthToken)(req);
    if (!token) {
        throw new Errors_1.UnauthorizedError(Errors_1.ErrorMessages.NoTokenProvided);
    }
    let { engagementId } = req.body;
    if (!engagementId) {
        engagementId = req.query.engagementId;
    }
    if (!engagementId) {
        return res.json({ message: 'No engagementId provided.' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.SECRET_KEY));
        const userId = decoded.userId;
        if (engagementId) {
            const [doesEngagementAdminExistResult] = yield database_1.pool.query('SELECT 1 FROM engagement_users WHERE user_id = ? AND engagement_id = ? AND role = "admin"', [userId, engagementId]);
            const [orgIdForEngagementResult] = yield database_1.pool.query('SELECT org_id FROM engagements WHERE id = ?', [engagementId]);
            const orgIdForEngagement = orgIdForEngagementResult[0].org_id;
            if (doesEngagementAdminExistResult.length) {
                req.userId = userId;
                req.engagementId = engagementId;
                req.orgId = orgIdForEngagement;
                return next();
            }
            else {
                return res.json({ message: 'Only administrators in this engagement can perform this operation.' });
            }
        }
    }
    catch (error) {
        next(error);
    }
});
