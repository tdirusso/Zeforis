const { pool, commonQueries } = require('../../../database');

module.exports = async (req, res, next) => {

  const { engagementId, orgId } = req;

  if (!orgId) {
    return res.json({ message: 'No orgId provided.' });
  }

  if (!engagementId) {
    return res.json({ message: 'No engagementId provided.' });
  }

  const connection = await pool.getConnection();

  try {

    const [engagementDataResult] = await pool.query('CALL getEngagementData(?,?)', [engagementId, orgId]);

    const [folders, tags, orgUsers, widgets] = engagementDataResult;

    const orgUsersMap = new Map();

    orgUsers.forEach(row => {
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

    const foldersIds = folders.length > 0 ? folders.map(folder => folder.id) : null;

    const [tasks] = await connection.query(
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

    const engagementData = {
      folders,
      tasks,
      tags,
      widgets,
      metadata: {
        orgUsers: [...orgUsersMap.values()],
        orgOwnerPlan
      }
    };

    return res.json({
      engagement: engagementData,
    });

  } catch (error) {
    connection.release();
    next(error);
  }
};