import { pool, commonQueries } from '../../database';
import moment from 'moment';
import { Request, Response, NextFunction } from 'express';
import { ResultSetHeader } from 'mysql2';
import { Tag } from '../../../shared/types/Tag';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    description,
    linkUrl,
    assignedToId = null,
    tags = [],
    isKeyTask = false,
    dateDue,
    taskId,
    currentTags = [],
    status
  } = req.body;

  let { folderId } = req.body;

  const creatorUserId = req.userId;
  const engagementId = req.engagementId;


  if (!name || !creatorUserId) {
    return res.json({
      message: 'Missing task parameters.'
    });
  }

  const connection = await pool.getConnection();

  try {
    if (!folderId) {
      folderId = await commonQueries.getEngagementHiddenFolder(connection, engagementId);
    }

    const [updatedTaskResult] = await pool.query<ResultSetHeader>(
      `
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
      `,
      [
        name,
        description,
        status || 'New',
        folderId,
        linkUrl,
        assignedToId,
        isKeyTask,
        dateDue ? moment(dateDue).format('YYYY-MM-DD HH:mm:ss') : null,
        creatorUserId,
        status,
        taskId
      ]
    );

    if (updatedTaskResult.affectedRows) {
      const removedTags = currentTags.filter((tag: Tag) => {
        return !tags.some((t: Tag) => t.id === tag.id);
      });

      const addedTags = tags.filter((tag: Tag) => {
        return !currentTags.some((t: Tag) => t.id === tag.id);
      });

      if (removedTags.length) {
        await pool.query('DELETE FROM task_tags WHERE task_id = ? AND tag_id IN (?)',
          [taskId, removedTags.map((t: Tag) => t.id)]
        );
      }

      if (addedTags.length) {
        const insertValues = addedTags.map((tag: Tag) => [tag.id, taskId]);

        await pool.query(
          'INSERT INTO task_tags (tag_id, task_id) VALUES ?',
          [insertValues]
        );
      }

      connection.release();
      return res.json({ success: true, placedFolderId: folderId });
    }

    return res.json({ message: 'Task not found.' });
  } catch (error) {
    connection.release();
    next(error);
  }
};