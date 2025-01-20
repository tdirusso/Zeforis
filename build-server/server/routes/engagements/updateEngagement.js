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
const uuid_1 = require("uuid");
const dbFieldsMapping = {
    'name': {
        databaseFieldName: 'name',
        databaseFieldType: 'string'
    },
    'isInviteLinkEnabled': {
        databaseFieldName: 'is_invite_link_enabled',
        databaseFieldType: 'boolean'
    },
    'allowedInviteDomains': {
        databaseFieldName: 'allowed_invite_domains',
        databaseFieldType: 'string'
    }
};
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updateRequestBody = req.body;
    const { engagement: { id: engagementId } } = req;
    if (Object.keys(updateRequestBody).length === 0) {
        throw new Errors_1.BadRequestError(`0 update fields provided - available fields: [${Object.keys(dbFieldsMapping).join(', ')}]`);
    }
    const fieldsToUpdate = [];
    const valuesToUpdate = [];
    const validationErrors = [];
    for (const field in dbFieldsMapping) {
        if (updateRequestBody[field] !== undefined) {
            const fieldMapping = dbFieldsMapping[field];
            const fieldValue = updateRequestBody[field];
            if (typeof fieldValue === fieldMapping.databaseFieldType) {
                fieldsToUpdate.push(`${fieldMapping.databaseFieldName} = ?`);
                valuesToUpdate.push(fieldValue);
            }
            else {
                validationErrors.push(`Invalid type "${typeof fieldValue}" received for field "${field}".`);
            }
        }
    }
    if (fieldsToUpdate.length === 0) {
        throw new Errors_1.BadRequestError(`No valid fields were provided - available fields: [${Object.keys(dbFieldsMapping).join(', ')}]`);
    }
    if (validationErrors.length) {
        throw new Errors_1.BadRequestError('Received field errors.', validationErrors);
    }
    let inviteHash;
    if (updateRequestBody.isInviteLinkEnabled) {
        inviteHash = (0, uuid_1.v4)().substring(0, 36);
        fieldsToUpdate.push('invite_link_hash = ?', 'is_invite_link_enabled = ?');
        valuesToUpdate.push(inviteHash, true);
    }
    else if (updateRequestBody.isInviteLinkEnabled === false) {
        fieldsToUpdate.push('invite_link_hash = ?', 'is_invite_link_enabled = ?');
        valuesToUpdate.push(null, false);
    }
    const updateClause = fieldsToUpdate.join(', ');
    const query = `UPDATE engagements SET ${updateClause} WHERE id = ?`;
    const params = [...valuesToUpdate, engagementId];
    const [updateResult] = yield database_1.pool.query(query, params);
    const [engagementResult] = yield database_1.pool.query(`
    SELECT 
    name,
    id,
    is_invite_link_enabled AS isInviteLinkEnabled,
    invite_link_hash AS inviteLinkHash,
    allowed_invite_domains AS allowedInviteDomains
    FROM engagements
    WHERE id = ?
  `, [engagementId]);
    if (updateResult.affectedRows) {
        return res.json({
            id: engagementResult[0].id,
            name: engagementResult[0].name,
            isInviteLinkEnabled: engagementResult[0].isInviteLinkEnabled,
            inviteLinkHash: engagementResult[0].inviteLinkHash,
            allowedInviteDomains: engagementResult[0].allowedInviteDomains
        });
    }
    throw new Errors_1.NotFoundError(`Engagement with id ${engagementId} not found.`);
});
