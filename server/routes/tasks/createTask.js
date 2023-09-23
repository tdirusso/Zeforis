const { pool, commonQueries } = require('../../../database');
const cache = require('../../../cache');
const { appLimits } = require('../../../config');

module.exports = async (req, res, next) => {
  const {
    name,
    description = '',
    status = 'New',
    folderId,
    linkUrl = '',
    assignedToId = null,
    tags = [],
    isKeyTask = false,
    dateDue = null
  } = req.body;

  const creatorUserId = req.userId;
  const userObject = req.userObject;

  if (!name || !folderId || !creatorUserId) {
    return res.json({
      message: 'Missing task parameters.'
    });
  }

  const connection = await pool.getConnection();

  try {

    let cachedOrgData = cache.get(`org-${userObject.orgId}`);
    let orgTaskCount = cachedOrgData?.taskCount;
    let orgOwnerPlan = cachedOrgData?.ownerPlan;

    if (orgOwnerPlan === undefined) {
      orgOwnerPlan = await commonQueries.getOrgOwnerPlan(connection, userObject.orgId);
      cachedOrgData = { ...cachedOrgData, ownerPlan: orgOwnerPlan };
    }

    if (orgOwnerPlan === 'free') {
      if (orgTaskCount === undefined) {
        orgTaskCount = await commonQueries.getOrgTaskCount(connection, userObject.orgId);
        cachedOrgData = { ...cachedOrgData, taskCount: orgTaskCount };
      }

      if (orgTaskCount >= appLimits.freePlanTasks) {
        cache.set(`org-${userObject.orgId}`, { ...cachedOrgData });
        return res.json({
          message: `Task limit of ${appLimits.freePlanTasks} has been reached.  Upgrade now for unlimited tasks.`
        });
      }
    }

    const newTask = await connection.query(
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
          last_updated_by_id
        ) 
        VALUES
        (?,?,?,?,?,?,?,?,?,?)`,
      [name, description, status, folderId, linkUrl, assignedToId, creatorUserId, isKeyTask, dateDue, creatorUserId]
    );

    const newTaskId = newTask[0].insertId;

    if (tags.length) {
      const insertValues = tags.map(tag => [tag.id, newTaskId]);

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

    if (userObject.plan === 'free') {
      cache.set(`org-${userObject.orgId}`, { ...cachedOrgData, taskCount: orgTaskCount + 1 });
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