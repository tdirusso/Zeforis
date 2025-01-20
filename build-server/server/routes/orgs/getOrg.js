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
    const { orgId } = req.query;
    if (!orgId) {
        return res.json({
            message: 'Missing orgId.'
        });
    }
    try {
        const [orgResult] = yield database_1.pool.query('SELECT name, brand_color as brandColor, logo_url as logo FROM orgs WHERE id = ?', [orgId]);
        const org = orgResult[0];
        if (org) {
            return res.json({
                org
            });
        }
        return res.json({
            error: 'Org does not exist.'
        });
    }
    catch (error) {
        next(error);
    }
});
