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
const dbFieldsMapping = {
    'firstName': {
        databaseFieldName: 'first_name',
        databaseFieldType: 'string'
    },
    'lastName': {
        databaseFieldName: 'last_name',
        databaseFieldType: 'string'
    }
};
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const updateRequestBody = req.body;
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
    const updateClause = fieldsToUpdate.join(', ');
    const query = `UPDATE users SET ${updateClause} WHERE id = ?`;
    const params = [...valuesToUpdate, userId];
    const [updateResult] = yield database_1.pool.query(query, params);
    if (updateResult.affectedRows) {
        const [userDataResult] = yield database_1.pool.query('CALL getUserData(?)', [userId]);
        const [userData, orgData] = userDataResult;
        const user = Object.assign(Object.assign({}, userData[0]), { orgs: orgData });
        return res.json(user);
    }
    throw new Errors_1.NotFoundError(`User with id ${userId} not found.`);
});
