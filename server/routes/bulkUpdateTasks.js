const pool = require('../../database');

module.exports = async (req, res) => {
  const {
    action,
    folderId,
    assigneeId,
    status,
    taskIds
  } = req.body;

  const updaterUserId = req.userId;

  if (!action || !taskIds || taskIds.length === 0 || (!folderId && !assigneeId && !status)) {
    return res.json({
      message: 'Missing task parameters.'
    });
  }

  try {

    switch (action) {
      case 'assignee':
        await updateAssignees(taskIds, assigneeId, updaterUserId);
        break;
      case 'folder':
        await updateFolders(taskIds, folderId, updaterUserId);
        break;
      case 'status':
        await updateStatuses(taskIds, status, updaterUserId);
        break;
      default:
        break;
    }

    const [updatedTasks] = await pool.query(
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
          WHERE tasks.id IN (?)
          GROUP BY tasks.id
        `,
      [taskIds]
    );

    return res.json({ updatedTasks });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};

async function updateAssignees(taskIds, assigneeId, updaterUserId) {
  await pool.query(
    'UPDATE tasks SET assigned_to_id = ?, last_updated_by_id = ? WHERE tasks.id IN (?)',
    [assigneeId, updaterUserId, taskIds]
  );
}

async function updateFolders(taskIds, folderId, updaterUserId) {
  await pool.query(
    'UPDATE tasks SET folder_id = ?, last_updated_by_id = ? WHERE tasks.id IN (?)',
    [folderId, updaterUserId, taskIds]
  );
}

async function updateStatuses(taskIds, status, updaterUserId) {
  await pool.query(
    'UPDATE tasks SET status = ?, last_updated_by_id = ? WHERE tasks.id IN (?)',
    [status, updaterUserId, taskIds]
  );
}