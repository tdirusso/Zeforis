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
const cache_1 = __importDefault(require("../../cache"));
const config_1 = require("../../config");
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description = '', status = 'New', linkUrl = '', assignedToId = null, tags = [], isKeyTask = false, dateDue = null } = req.body;
    let { folderId } = req.body;
    const creatorUserId = req.userId;
    const engagementId = req.engagementId;
    const orgId = req.orgId;
    if (!name || !creatorUserId) {
        return res.json({
            message: 'Missing task parameters.'
        });
    }
    const connection = yield database_1.pool.getConnection();
    try {
        let orgTaskCount = -1;
        const orgOwnerPlan = yield database_1.commonQueries.getOrgOwnerPlan(connection, orgId);
        if (orgOwnerPlan === 'free') {
            orgTaskCount = yield database_1.commonQueries.getOrgTaskCount(connection, orgId);
            if (orgTaskCount === -1) {
                return res.json({ message: `Could not get task count for orgId ${orgId}` });
            }
            if (orgTaskCount >= config_1.appLimits.freePlanTasks) {
                return res.json({
                    message: `Task limit of ${config_1.appLimits.freePlanTasks} has been reached.`,
                    uiProps: {
                        alertType: 'upgrade'
                    }
                });
            }
        }
        if (!folderId) {
            folderId = yield database_1.commonQueries.getEngagementHiddenFolder(connection, engagementId);
        }
        const newTask = yield connection.query(`INSERT INTO tasks 
        (
          name,
          description,
          status, 
          folder_id, 
          link_url,
          assigned_to_id, 
          created_by_id,
          is_key_task,
          date_due, 
          last_updated_by_id,
          date_completed
        ) 
        VALUES
        (?,?,?,?,?,?,?,?,?,?, ${status === 'Complete' ? 'CURRENT_TIMESTAMP' : 'NULL'})`, [name, description, status, folderId, linkUrl, assignedToId, creatorUserId, isKeyTask, dateDue, creatorUserId]);
        const newTaskId = newTask[0].insertId;
        if (tags.length) {
            const insertValues = tags.map((tag) => [tag.id, newTaskId]);
            yield connection.query('INSERT INTO task_tags (tag_id, task_id) VALUES ?', [insertValues]);
        }
        const taskObject = {
            id: newTaskId,
            name,
            description,
            status,
            folderId,
            linkUrl,
            assignedToId,
            tags,
            isKeyTask,
            dateDue
        };
        connection.release();
        if (orgOwnerPlan === 'free') {
            cache_1.default.set(`org-${orgId}`, Object.assign(Object.assign({}, cache_1.default.get(`org-${orgId}`)), { taskCount: orgTaskCount + 1 }));
        }
        return res.json({
            success: true,
            task: taskObject
        });
    }
    catch (error) {
        connection.release();
        next(error);
    }
});
