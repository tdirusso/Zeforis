import { pool, commonQueries } from '../../database';
import cache from '../../cache';
import { appLimits } from '../../config';
import { Request, Response, NextFunction } from 'express';
import { ResultSetHeader } from 'mysql2';
import { Tag } from '../../../shared/types/Tag';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    description = '',
    status = 'New',
    linkUrl = '',
    assignedToId = null,
    tags = [],
    isKeyTask = false,
    dateDue = null
  } = req.body;

  let { folderId } = req.body;

  const creatorUserId = req.userId;
  const engagementId = req.engagementId;
  const orgId = req.orgId;

  if (!name || !creatorUserId) {
    return res.json({
      message: 'Missing task parameters.'
    });
  }

  const connection = await pool.getConnection();

  try {
    let orgTaskCount = -1;

    const orgOwnerPlan = await commonQueries.getOrgOwnerPlan(connection, orgId);

    if (orgOwnerPlan === 'free') {
      orgTaskCount = await commonQueries.getOrgTaskCount(connection, orgId);

      if (orgTaskCount === -1) {
        return res.json({ message: `Could not get task count for orgId ${orgId}` });
      }

      if (orgTaskCount >= appLimits.freePlanTasks) {
        return res.json({
          message: `Task limit of ${appLimits.freePlanTasks} has been reached.`,
          uiProps: {
            alertType: 'upgrade'
          }
        });
      }
    }

    if (!folderId) {
      folderId = await commonQueries.getEngagementHiddenFolder(connection, engagementId);
    }

    const newTask = await connection.query<ResultSetHeader>(
      `INSERT INTO tasks 
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
        (?,?,?,?,?,?,?,?,?,?, ${status === 'Complete' ? 'CURRENT_TIMESTAMP' : 'NULL'})`,
      [name, description, status, folderId, linkUrl, assignedToId, creatorUserId, isKeyTask, dateDue, creatorUserId]
    );

    const newTaskId = newTask[0].insertId;

    if (tags.length) {
      const insertValues = tags.map((tag: Tag) => [tag.id, newTaskId]);

      await connection.query(
        'INSERT INTO task_tags (tag_id, task_id) VALUES ?',
        [insertValues]
      );
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
      cache.set(`org-${orgId}`, { ...cache.get(`org-${orgId}`), taskCount: orgTaskCount + 1 });
    }

    return res.json({
      success: true,
      task: taskObject
    });
  } catch (error) {
    connection.release();
    next(error);
  }
};