const pool = require('../../../database');
const moment = require('moment');

module.exports = async (req, res) => {
  const {
    action,
    folderId,
    assigneeId,
    status,
    taskIds,
    dateDue,
    isKey
  } = req.body;

  const updaterUserId = req.userId;

  console.log(action, taskIds, isKey);

  if (!action) {
    return res.json({
      message: 'Missing action.'
    });
  }

  if (!taskIds || taskIds.length === 0) {
    return res.json({
      message: 'Missing taskIds.'
    });
  }

  const connection = await pool.getConnection();

  try {
    switch (action) {
      case 'assignee':
        if (!assigneeId) {
          return res.json({
            message: 'Missing assigneeId.'
          });
        } else {
          await updateAssignees(taskIds, assigneeId, updaterUserId, connection);
        }
        break;
      case 'folder':
        if (!folderId) {
          return res.json({
            message: 'Missing folderId.'
          });
        } else {
          await updateFolders(taskIds, folderId, updaterUserId, connection);
        }
        break;
      case 'status':
        if (!status) {
          return res.json({
            message: 'Missing status.'
          });
        } else {
          await updateStatuses(taskIds, status, updaterUserId, connection);
        }
        break;
      case 'dateDue':
        await updateDateDue(taskIds, dateDue, updaterUserId, connection);
        break;
      case 'keyTask':
        if (!isKey) {
          return res.json({
            message: 'Missing isKey.'
          });
        } else {
          await updateKeyTask(taskIds, isKey, updaterUserId, connection);
        }
        break;
      default:
        break;
    }

    const [updatedTasks] = await connection.query(
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
          WHERE tasks.id IN (?)
          GROUP BY tasks.id
        `,
      [taskIds]
    );

    connection.release();

    return res.json({ updatedTasks });
  } catch (error) {
    console.log(error);

    connection.release();
    return res.json({
      message: error.message
    });
  }
};

async function updateDateDue(taskIds, dateDue, updaterUserId, connection) {
  await connection.query(
    'UPDATE tasks SET date_due = ?, last_updated_by_id = ? WHERE tasks.id IN (?)',
    [
      dateDue ? moment(dateDue).format('YYYY-MM-DD HH:mm:ss') : null,
      updaterUserId,
      taskIds
    ]
  );
}

async function updateAssignees(taskIds, assigneeId, updaterUserId, connection) {
  await connection.query(
    'UPDATE tasks SET assigned_to_id = ?, last_updated_by_id = ? WHERE tasks.id IN (?)',
    [assigneeId, updaterUserId, taskIds]
  );
}

async function updateFolders(taskIds, folderId, updaterUserId, connection) {
  await connection.query(
    'UPDATE tasks SET folder_id = ?, last_updated_by_id = ? WHERE tasks.id IN (?)',
    [folderId, updaterUserId, taskIds]
  );
}

async function updateStatuses(taskIds, status, updaterUserId, connection) {
  if (status === 'Complete') {
    await connection.query(
      'UPDATE tasks SET status = ?, last_updated_by_id = ?, date_completed = CURRENT_TIMESTAMP WHERE tasks.id IN (?)',
      [status, updaterUserId, taskIds]
    );
  } else {
    await connection.query(
      'UPDATE tasks SET status = ?, last_updated_by_id = ?, date_completed = NULL WHERE tasks.id IN (?)',
      [status, updaterUserId, taskIds]
    );
  }
}


async function updateKeyTask(taskIds, isKey, updaterUserId, connection) {
  await connection.query(
    'UPDATE tasks SET is_key_task = ?, last_updated_by_id = ? WHERE tasks.id IN (?)',
    [isKey === 'yes' ? 1 : 0, updaterUserId, taskIds]
  );
}