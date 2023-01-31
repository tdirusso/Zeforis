const pool = require('../../database');

module.exports = async (req, res) => {
  const {
    name,
    description,
    status = 'New',
    folderId,
    linkUrl,
    assignedToId,
    progress = 0,
    tags = [],
    isKeyTask = false,
    dueDate
  } = req.body;

  const creatorUserId = req.userId;

  if (!name || !folderId || !creatorUserId) {
    return res.json({
      message: 'Missing task parameters.'
    });
  }

  try {
    const newTask = await pool.query(
      `INSERT INTO tasks 
        (
          name,
          description,
          status, 
          folder_id, 
          link_url,
          assigned_to_id, 
          progress, 
          created_by_id,
          is_key_task,
          date_due, 
          last_updated_by_id
        ) 
        VALUES
        (?,?,?,?,?,?,?,?,?,?,?)`,
      [name, description, status, folderId, linkUrl, assignedToId, progress, creatorUserId, isKeyTask, dueDate, creatorUserId]
    );

    const newTaskId = newTask[0].insertId;

    if (tags.length) {
      const insertValues = tags.map(tag => [tag.id, newTaskId]);

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
          tasks.description,
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
      [newTaskId]
    );

    return res.json({ task: insertedTask[0] });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};