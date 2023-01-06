const pool = require('../../database');

module.exports = async (req, res) => {

  const { clientId, accountId } = req.query;

  if (!clientId) {
    return res.json({ message: 'No clientId provided.' });
  }

  try {

    const [folders] = await pool.query(
      'SELECT * FROM folders WHERE client_id = ?',
      [clientId]
    );

    const [tags] = await pool.query(
      'SELECT * FROM tags WHERE client_id = ? ORDER BY tags.name',
      [clientId]
    );

    const [accountUsers] = await pool.query(
      `
        SELECT 
          users.id as user_id,
          users.first_name, 
          users.last_name,
          users.email,
          clients.id as client_id,
          clients.name as client_name,
          client_users.role
        FROM client_users
        LEFT JOIN clients ON client_users.client_id = clients.id
        LEFT JOIN users ON client_users.user_id = users.id
        LEFT JOIN accounts ON accounts.id = clients.account_id
        WHERE clients.account_id = ?
        ORDER BY users.first_name
      `,
      [accountId]
    );

    const accountUsersMap = {};

    accountUsers.forEach(row => {
      const {
        client_id,
        client_name,
        user_id,
        first_name,
        last_name,
        role,
        email
      } = row;

      if (!accountUsersMap[user_id]) {
        accountUsersMap[user_id] = {
          firstName: first_name,
          lastName: last_name,
          email,
          id: user_id,
          memberOfClients: [],
          adminOfClients: []
        };
      }

      if (role === 'admin') {
        accountUsersMap[user_id].adminOfClients.push({
          id: client_id,
          name: client_name
        });
      } else {
        accountUsersMap[user_id].memberOfClients.push({
          id: client_id,
          name: client_name
        });
      }
    });

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

    return res.json({
      folders,
      tasks,
      tags,
      accountUsers: Object.values(accountUsersMap)
    });

  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};