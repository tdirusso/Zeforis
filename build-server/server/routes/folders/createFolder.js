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
    const { name, isKeyFolder = false, parentId = null } = req.body;
    const { engagementId } = req;
    if (!name || !engagementId) {
        return res.json({
            message: 'Missing folder name or engagementId.'
        });
    }
    try {
        const newFolder = yield database_1.pool.query('INSERT INTO folders (name, engagement_id, is_key_folder, parent_id) VALUES (?,?,?,?)', [name, engagementId, isKeyFolder, parentId]);
        const folderObject = {
            id: newFolder[0].insertId,
            name,
            engagement_id: engagementId,
            is_key_folder: isKeyFolder,
            parent_id: parentId
        };
        return res.json({
            success: true,
            folder: folderObject
        });
    }
    catch (error) {
        next(error);
    }
});
