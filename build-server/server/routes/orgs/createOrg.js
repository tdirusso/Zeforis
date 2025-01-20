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
    const { name } = req.body;
    const creatorUserId = req.userId;
    if (!creatorUserId) {
        return res.json({
            message: 'Missing userId.'
        });
    }
    if (!name) {
        return res.json({
            message: 'Missing organization name.'
        });
    }
    try {
        const [ownedOrg] = yield database_1.pool.query('SELECT name FROM orgs WHERE owner_id = ?', [creatorUserId]);
        if (ownedOrg.length) {
            return res.json({
                message: `You already own an organization (${ownedOrg[0].name})`
            });
        }
        const newOrg = yield database_1.pool.query('INSERT INTO orgs (name, owner_id, brand_color) VALUES (?,?, "#3365f6")', [name, creatorUserId]);
        return res.json({ orgId: newOrg[0].insertId });
    }
    catch (error) {
        next(error);
    }
});
