const pool = require('../../database');

module.exports = async (req, res) => {
  const {
    name,
    description,
    status = 'New',
    folderId,
    linkUrl,
    assignedToId,
    tags = [],
    isKeyTask = false,
    dueDate,
    taskId,
    currentTags = []
  } = req.body;

  let { progress = 0 } = req.body;

  const creatorUserId = req.userId;

  if (!name || !folderId || !creatorUserId || !assignedToId) {
    return res.json({
      message: 'Missing task parameters.'
    });
  }

  try {
    if (status === 'Complete') {
      progress = 100;
    }

    const [updatedTaskResult] = await pool.query(
      `
        UPDATE tasks SET 
            name = ?,
            description = ?,
            status = ?,
            folder_id = ?,
            link_url = ?,
            assigned_to_id = ?,
            progress = ?,
            is_key_task = ?,
            date_due = ?,
            last_updated_by_id = ?
         WHERE id = ? 
      `,
      [name, description, status, folderId, linkUrl, assignedToId, progress, isKeyTask, dueDate, creatorUserId, taskId]
    );

    if (updatedTaskResult.affectedRows) {
      const removedTags = currentTags.filter(tag => {
        return !tags.some(t => t.id === tag.id);
      });

      const addedTags = tags.filter(tag => {
        return !currentTags.some(t => t.id === tag.id);
      });

      if (removedTags.length) {
        await pool.query('DELETE FROM task_tags WHERE task_id = ? AND tag_id IN (?)',
          [taskId, removedTags.map(t => t.id)]
        );
      }

      if (addedTags.length) {
        const insertValues = addedTags.map(tag => [tag.id, taskId]);

        await pool.query(
          'INSERT INTO task_tags (tag_id, task_id) VALUES ?',
          [insertValues]
        );
      }

      const [insertedTask] = await pool.query(
        `
          SELECT
            tasks.id as task_id,
            tasks.name as task_name,
            tasks.description as task_description,
            tasks.date_created,
            tasks.created_by_id,
            tasks.status,
            tasks.folder_id,
            tasks.link_url,
            tasks.assigned_to_id,
            tasks.progress,
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
          WHERE tasks.id = ?
        `,
        [taskId]
      );

      return res.json({ updatedTask: insertedTask[0] });
    }

    return res.json({ message: 'Task not found.' });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};