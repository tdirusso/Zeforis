const pool = require('../../database');

module.exports = async (req, res) => {

  const { clientId } = req.query;

  if (!clientId) {
    return res.json({ message: 'No clientId provided.' });
  }

  try {

    const [folders] = await pool.query(
      'SELECT * FROM folders WHERE client_id = ?',
      [clientId]
    );

    const [tags] = await pool.query(
      'SELECT * FROM tags WHERE client_id = ?',
      [clientId]
    );

    const [clientUsers] = await pool.query(
      `
        SELECT 
        users.first_name, users.last_name, users.id, client_users.role
        FROM client_users 
        LEFT JOIN users ON client_users.user_id = users.id
        WHERE client_users.client_id = ?
      `,
      [clientId]
    );

    const foldersIds = folders.map(folder => folder.id);
    const [tasks] = await pool.query(
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
          group_CONCAT(tags.id, ':', tags.name) as tags,
          assigned_user.first_name as assigned_first,
          assigned_user.last_name as assigned_last,
          created_user.first_name as created_first,
          created_user.last_name as created_last
        FROM tasks
        LEFT JOIN task_tags ON task_tags.task_id = tasks.id
        LEFT JOIN tags ON tags.id = task_tags.tag_id
        LEFT JOIN users as assigned_user ON tasks.assigned_to_id = assigned_user.id
        LEFT JOIN users as created_user ON tasks.created_by_id = created_user.id
        WHERE tasks.folder_id IN (?)
        GROUP BY tasks.id
      `,
      [foldersIds]
    );

    return res.json({ folders, clientUsers, tasks, tags });

  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};