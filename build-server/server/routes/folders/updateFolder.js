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
    const { name, isKeyFolder, folderId, parentId } = req.body;
    const { engagementId } = req;
    if (!name || !folderId) {
        return res.json({
            message: 'Missing folder parameters.'
        });
    }
    if (name === '_hidden_') {
        return res.json({
            message: 'Invalid folder name - "_hidden_" is reserved.'
        });
    }
    if (parentId && folderId === parentId) {
        return res.json({
            message: "Folder cannot be it's own parent."
        });
    }
    try {
        yield database_1.pool.query('UPDATE folders SET name = ?, is_key_folder = ?, parent_id = ? WHERE id = ?', [name, isKeyFolder, parentId, folderId]);
        const folderObject = {
            id: folderId,
            name,
            engagement_id: engagementId,
            is_key_folder: isKeyFolder,
            parent_id: parentId
        };
        return res.json({ updatedFolder: folderObject });
    }
    catch (error) {
        next(error);
    }
});
