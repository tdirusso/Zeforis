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
    // const [tasksResult] = await pool.query(
    //   `
    //     SELECT
    //       tasks.id as task_id,
    //       tasks.name as task_name,
    //       tasks.description as task_description,
    //       status,
    //       folder_id,
    //       link_url,
    //       assigned_to_id,
    //       progress,
    //       date_completed,
    //       tasks.date_created,
    //       GROUP_CONCAT(tags.id, ':', tags.name) as tags,
    //       users.first_name,
    //       users.last_name
    //       FROM tasks
    //       LEFT JOIN task_tags ON task_tags.task_id = tasks.id
    //       LEFT JOIN tags ON tags.id = task_tags.tag_id
    //       LEFT JOIN users ON tasks.assigned_to_id = users.id
    //       WHERE tasks.folder_id IN ?
    //   `,
    //   [foldersIds]
    // );

    //const folders = await Folder.find({ client: clientId }).lean();
    // const folderIds = folders.map(folder => folder._id.toString());

    // let tasks = await Task.find({ folder: { $in: folderIds } }).lean();

    // const foldersMap = new Map(folders.map(folder => [folder._id.toString(), folder]));

    // tasks = [{ folder: '63a36cf749bb76fc0bdd963e', name: 'task 1' }];

    // tasks.forEach(task => {
    //   const folderId = task.folder.toString();

    //   const folder = foldersMap.get(folderId);

    //   if (folder.tasks) {
    //     folder.tasks.push(task);
    //   } else {
    //     folder.tasks = [task];
    //   }
    // });

    return res.json({ folders, clientUsers });

    // return res.json({ folders: Array.from(foldersMap, ([name, value]) => value) });

  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};