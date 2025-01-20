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
const database_1 = require("../../database");
const moment_1 = __importDefault(require("moment"));
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, linkUrl, assignedToId = null, tags = [], isKeyTask = false, dateDue, taskId, currentTags = [], status } = req.body;
    let { folderId } = req.body;
    const creatorUserId = req.userId;
    const engagementId = req.engagementId;
    if (!name || !creatorUserId) {
        return res.json({
            message: 'Missing task parameters.'
        });
    }
    const connection = yield database_1.pool.getConnection();
    try {
        if (!folderId) {
            folderId = yield database_1.commonQueries.getEngagementHiddenFolder(connection, engagementId);
        }
        const [updatedTaskResult] = yield database_1.pool.query(`
        UPDATE tasks SET 
          name = ?,
          description = ?,
          status = ?,
          folder_id = ?,
          link_url = ?,
          assigned_to_id = ?,
          is_key_task = ?,
          date_due = ?,
          last_updated_by_id = ?,
          date_completed = 
            CASE 
              WHEN date_completed IS NULL AND ? = 'Complete' THEN CURRENT_TIMESTAMP
              ELSE date_completed
            END
        WHERE id = ? 
      `, [
            name,
            description,
            status || 'New',
            folderId,
            linkUrl,
            assignedToId,
            isKeyTask,
            dateDue ? (0, moment_1.default)(dateDue).format('YYYY-MM-DD HH:mm:ss') : null,
            creatorUserId,
            status,
            taskId
        ]);
        if (updatedTaskResult.affectedRows) {
            const removedTags = currentTags.filter((tag) => {
                return !tags.some((t) => t.id === tag.id);
            });
            const addedTags = tags.filter((tag) => {
                return !currentTags.some((t) => t.id === tag.id);
            });
            if (removedTags.length) {
                yield database_1.pool.query('DELETE FROM task_tags WHERE task_id = ? AND tag_id IN (?)', [taskId, removedTags.map((t) => t.id)]);
            }
            if (addedTags.length) {
                const insertValues = addedTags.map((tag) => [tag.id, taskId]);
                yield database_1.pool.query('INSERT INTO task_tags (tag_id, task_id) VALUES ?', [insertValues]);
            }
            connection.release();
            return res.json({ success: true, placedFolderId: folderId });
        }
        return res.json({ message: 'Task not found.' });
    }
    catch (error) {
        connection.release();
        next(error);
    }
});
