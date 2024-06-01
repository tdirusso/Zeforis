import { pool, commonQueries } from '../../database';
import { Request, Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2';
import { Engagement } from '../../../shared/types/Engagement';
import { Folder } from '../../../shared/types/Folder';
import { Tag } from '../../../shared/types/Tag';
import { User } from '../../../shared/types/User';
import { Widget } from '../../../shared/types/Widget';
import { Task } from '../../../shared/types/Task';
import { Invitation } from '../../../shared/types/Invitation';

type EngagementQueryResultType = [
  Folder[] & RowDataPacket[],
  Tag[] & RowDataPacket[],
  User[] & RowDataPacket[],
  Widget[] & RowDataPacket[],
  Invitation[] & RowDataPacket[]
];

export default async (req: Request, res: Response<Engagement>) => {

  const {
    engagementId,
    engagement,
    orgId
  } = req;

  const connection = await pool.getConnection();

  const [engagementDataResult] = await pool.query<EngagementQueryResultType>('CALL getEngagementData(?,?)', [engagementId, orgId]);

  const [folders, tags, orgUsers, widgets, invitations] = engagementDataResult;

  const orgUsersMap = new Map();

  orgUsers.forEach((row: RowDataPacket) => {
    const {
      engagement_id,
      engagement_name,
      user_id,
      first_name,
      last_name,
      role,
      email
    } = row;

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
    } else {
      mappedUser.memberOfEngagements.push({
        id: engagement_id,
        name: engagement_name
      });
    }
  });

  const foldersIds = folders.length > 0 ? folders.map((folder: RowDataPacket) => folder.id) : null;

  const [tasks] = await connection.query<Task[] & RowDataPacket[]>(
    `
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
      `,
    [foldersIds]
  );

  const orgOwnerPlan = await commonQueries.getOrgOwnerPlan(connection, orgId);

  connection.release();

  const engagementObject: Engagement = {
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
};