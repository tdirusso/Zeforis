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
const moment_1 = __importDefault(require("moment"));
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { importRows = [] } = req.body;
    const { engagementId } = req;
    const creatorUserId = req.userId;
    const { orgId } = req;
    if (!engagementId || importRows.length === 0) {
        return res.json({
            message: 'Missing import parameters.'
        });
    }
    const connection = yield database_1.pool.getConnection();
    yield connection.beginTransaction();
    try {
        const orgOwnerPlan = yield database_1.commonQueries.getOrgOwnerPlan(connection, orgId);
        let orgTaskCount = -1;
        if (orgOwnerPlan === 'free') {
            orgTaskCount = yield database_1.commonQueries.getOrgTaskCount(connection, orgId);
            if (orgTaskCount === -1) {
                return res.json({ message: `Could not get task count for orgId ${orgId}` });
            }
            if (orgTaskCount >= config_1.appLimits.freePlanTasks) {
                yield connection.rollback();
                connection.release();
                return res.json({
                    message: `Task limit of ${config_1.appLimits.freePlanTasks} has been reached.  Upgrade now for unlimited tasks.`
                });
            }
            else if (orgTaskCount + importRows.length > config_1.appLimits.freePlanTasks) {
                yield connection.rollback();
                connection.release();
                return res.json({
                    message: `Cannot import - task limit of ${config_1.appLimits.freePlanTasks} will be exceeded.  Upgrade now for unlimited tasks.`
                });
            }
        }
        const [existingFolders] = yield connection.query(`SELECT id, name FROM folders WHERE engagement_id = ?`, [engagementId]);
        const [existingTags] = yield connection.query(`SELECT id, name FROM tags WHERE engagement_id = ?`, [engagementId]);
        const folderNameToIdMap = {};
        const tagNameToIdMap = {};
        existingFolders.forEach(({ name, id }) => folderNameToIdMap[name] = id);
        existingTags.forEach(({ name, id }) => tagNameToIdMap[name] = id);
        const newFoldersSet = new Set();
        const newTagsSet = new Set();
        importRows.forEach((row) => {
            const { name, folder, tagsArray = [], } = row;
            if (name && folder) {
                if (!folderNameToIdMap[folder]) {
                    newFoldersSet.add(folder);
                }
                tagsArray.forEach(tag => {
                    if (!tagNameToIdMap[tag]) {
                        newTagsSet.add(tag);
                    }
                });
            }
        });
        const foldersArray = [...newFoldersSet];
        const tagsArray = [...newTagsSet];
        const folderInsertVals = foldersArray.map(folder => [folder, engagementId]);
        const tagsInsertVals = tagsArray.map(tag => [tag, engagementId]);
        if (folderInsertVals.length > 0) {
            const insertResult = yield connection.query(`INSERT INTO folders (name, engagement_id) VALUES ?`, [folderInsertVals]);
            let insertId = insertResult[0].insertId;
            foldersArray.forEach(folder => folderNameToIdMap[folder] = insertId++);
        }
        if (tagsInsertVals.length > 0) {
            const insertResult = yield connection.query(`INSERT INTO tags (name, engagement_id) VALUES ?`, [tagsInsertVals]);
            let insertId = insertResult[0].insertId;
            tagsArray.forEach(tag => tagNameToIdMap[tag] = insertId++);
        }
        const taskInsertVals = [];
        importRows.forEach((row) => {
            const { name, description = '', status, folder, url = '', isKeyTask = false, dateDue } = row;
            if (name && folder) {
                taskInsertVals.push([
                    name,
                    description,
                    status || 'New',
                    folderNameToIdMap[folder],
                    url,
                    Number(isKeyTask),
                    creatorUserId,
                    creatorUserId,
                    status === 'Complete' ? 'CURRENT_TIMESTAMP' : null,
                    dateDue ? (0, moment_1.default)(dateDue).endOf('day').format('YYYY-MM-DD HH:mm:ss') : null
                ]);
            }
        });
        const insertResult = yield connection.query(`INSERT INTO tasks (name, description, status, folder_id, link_url, is_key_task, created_by_id, last_updated_by_id, date_completed, date_due)
       VALUES ?`, [taskInsertVals]);
        let insertId = insertResult[0].insertId;
        let taskTagsInsertVals = [];
        importRows.forEach((row) => {
            const { tagsArray = [] } = row;
            const taskId = insertId;
            tagsArray.forEach(tag => {
                taskTagsInsertVals.push([taskId, tagNameToIdMap[tag]]);
            });
            insertId++;
        });
        if (taskTagsInsertVals.length) {
            yield connection.query(`INSERT INTO task_tags (task_id, tag_id) VALUES ?`, [taskTagsInsertVals]);
        }
        if (orgOwnerPlan === 'free') {
            cache_1.default.set(`org-${orgId}`, Object.assign(Object.assign({}, cache_1.default.get(`org-${orgId}`)), { taskCount: orgTaskCount + taskInsertVals.length }));
        }
        yield connection.commit();
        connection.release();
        return res.json({
            success: true
        });
    }
    catch (error) {
        yield connection.rollback();
        connection.release();
        next(error);
    }
});
