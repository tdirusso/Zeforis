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
    const { userId, engagementId, invitationCode } = req.query;
    if (!engagementId || !userId || !invitationCode) {
        return res.json({
            message: 'Missing invitation params.'
        });
    }
    const connection = yield database_1.pool.getConnection();
    try {
        const [invitationResult] = yield connection.query('SELECT user_id FROM engagement_users WHERE engagement_id = ? AND user_id = ? AND invitation_code = ?', [engagementId, userId, invitationCode]);
        const invitation = invitationResult[0];
        if (!invitation) {
            connection.release();
            return res.json({
                message: 'No invitation found.'
            });
        }
        const [userResult] = yield connection.query('SELECT id, email, first_name as firstName, last_name as lastName FROM users WHERE id = ?', [userId]);
        const user = userResult[0];
        if (!user) {
            connection.release();
            return res.json({
                message: 'No invitation found.'
            });
        }
        const userNeedsName = Boolean(!user.firstName && !user.lastName);
        yield connection.query('UPDATE engagement_users SET invitation_code = NULL WHERE engagement_id = ? AND user_id = ? AND invitation_code = ?', [engagementId, userId, invitationCode]);
        connection.release();
        return res.json({
            invitation: {
                userNeedsName
            }
        });
    }
    catch (error) {
        connection.release();
        next(error);
    }
});
