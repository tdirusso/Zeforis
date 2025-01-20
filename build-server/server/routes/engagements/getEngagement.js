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
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { engagement, engagement: { id: engagementId }, orgId } = req;
    const connection = yield database_1.pool.getConnection();
    const [engagementDataResult] = yield database_1.pool.query('CALL getEngagementData(?,?)', [engagementId, orgId]);
    const [folders, tags, orgUsers, widgets, invitations] = engagementDataResult;
    const orgUsersMap = new Map();
    orgUsers.forEach((row) => {
        const { engagement_id, engagement_name, user_id, first_name, last_name, role, email } = row;
        let mappedUser = orgUsersMap.get(user_id);
        if (!mappedUser) {
            mappedUser = orgUsersMap.set(user_id, {
                firstName: first_name,
                lastName: last_name,
                email,
                id: user_id,
                memberOfEngagements: [],
                adminOfEngagements: []
            }).get(user_id);
        }
        if (role === 'admin') {
            mappedUser.adminOfEngagements.push({
                id: engagement_id,
                name: engagement_name
            });
        }
        else {
            mappedUser.memberOfEngagements.push({
                id: engagement_id,
                name: engagement_name
            });
        }
    });
    const foldersIds = folders.length > 0 ? folders.map((folder) => folder.id) : null;
    const [tasks] = yield connection.query(`
        SELECT
          tasks.id as task_id,
          tasks.name as task_name,
          tasks.description,
          tasks.date_created,
          tasks.created_by_id,
          tasks.status,
          tasks.folder_id,
          tasks.link_url,
          tasks.assigned_to_id,
          tasks.date_completed,
          tasks.is_key_task,
          tasks.date_due,
          tasks.date_last_updated,
          group_CONCAT(tags.id) as tags,
          assigned_user.first_name as assigned_first,
          assigned_user.last_name as assigned_last,
          created_user.first_name as created_first,
          created_user.last_name as created_last,
          updated_by_user.first_name as updated_by_first,
          updated_by_user.last_name as updated_by_last
        FROM tasks
        LEFT JOIN task_tags ON task_tags.task_id = tasks.id
        LEFT JOIN tags ON tags.id = task_tags.tag_id
        LEFT JOIN users as assigned_user ON tasks.assigned_to_id = assigned_user.id
        LEFT JOIN users as created_user ON tasks.created_by_id = created_user.id
        LEFT JOIN users as updated_by_user ON tasks.last_updated_by_id = updated_by_user.id
        WHERE tasks.folder_id IN (?)
        GROUP BY tasks.id
      `, [foldersIds]);
    const orgOwnerPlan = yield database_1.commonQueries.getOrgOwnerPlan(connection, orgId);
    connection.release();
    const engagementObject = {
        id: engagementId,
        name: engagement.name,
        inviteLinkHash: engagement.inviteLinkHash,
        isInviteLinkEnabled: engagement.isInviteLinkEnabled,
        folders,
        tasks,
        tags,
        widgets,
        invitations,
        metadata: {
            orgUsers: [...orgUsersMap.values()],
            orgOwnerPlan
        }
    };
    return res.json(engagementObject);
});
