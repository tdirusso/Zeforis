const { pool, commonQueries } = require('../../database');
const cache = require('../../cache');
const { appLimits } = require('../../config');

module.exports = async (req, res, next) => {
  const {
    importRows = []
  } = req.body;

  const { engagementId } = req;
  const creatorUserId = req.userId;
  const userObject = req.userObject;
  const { orgId } = userObject;

  if (!engagementId || importRows.length === 0) {
    return res.json({
      message: 'Missing import parameters.'
    });
  }

  const connection = await pool.getConnection();

  await connection.beginTransaction();

  try {
    const orgOwnerPlan = await commonQueries.getOrgOwnerPlan(connection, orgId);

    let orgTaskCount = null;

    if (orgOwnerPlan === 'free') {
      orgTaskCount = await commonQueries.getOrgTaskCount(connection, orgId);

      if (orgTaskCount >= appLimits.freePlanTasks) {
        await connection.rollback();
        connection.release();
        return res.json({
          message: `Task limit of ${appLimits.freePlanTasks} has been reached.  Upgrade now for unlimited tasks.`
        });
      } else if (orgTaskCount + importRows.length > appLimits.freePlanTasks) {
        await connection.rollback();
        connection.release();
        return res.json({
          message: `Cannot import - task limit of ${appLimits.freePlanTasks} will be exceeded.  Upgrade now for unlimited tasks.`
        });
      }
    }

    const [existingFolders] = await connection.query(
      `SELECT id, name FROM folders WHERE engagement_id = ?`,
      [engagementId]
    );

    const [existingTags] = await connection.query(
      `SELECT id, name FROM tags WHERE engagement_id = ?`,
      [engagementId]
    );

    const folderNameToIdMap = {};
    const tagNameToIdMap = {};

    existingFolders.forEach(({ name, id }) => folderNameToIdMap[name] = id);
    existingTags.forEach(({ name, id }) => tagNameToIdMap[name] = id);

    const newFoldersSet = new Set();
    const newTagsSet = new Set();

    importRows.forEach(row => {
      const {
        name,
        folder,
        tagsArray = [],
      } = row;

      if (name && folder) {
        if (!folderNameToIdMap[folder]) {
          newFoldersSet.add(folder);
        }

        tagsArray.forEach(tag => {
          if (!tagNameToIdMap[tag]) {
            newTagsSet.add(tag);
          }
        });
      }
    });

    const foldersArray = [...newFoldersSet];
    const tagsArray = [...newTagsSet];

    const folderInsertVals = foldersArray.map(folder => [folder, engagementId]);
    const tagsInsertVals = tagsArray.map(tag => [tag, engagementId]);

    if (folderInsertVals.length > 0) {
      const insertResult = await connection.query(
        `INSERT INTO folders (name, engagement_id) VALUES ?`,
        [folderInsertVals]
      );

      let insertId = insertResult[0].insertId;
      foldersArray.forEach(folder => folderNameToIdMap[folder] = insertId++);
    }

    if (tagsInsertVals.length > 0) {
      const insertResult = await connection.query(
        `INSERT INTO tags (name, engagement_id) VALUES ?`,
        [tagsInsertVals]
      );

      let insertId = insertResult[0].insertId;
      tagsArray.forEach(tag => tagNameToIdMap[tag] = insertId++);
    }

    const taskInsertVals = [];

    importRows.forEach(row => {
      const {
        name,
        description = '',
        status,
        folder,
        url = '',
        isKeyTask = false
      } = row;

      if (name && folder) {
        taskInsertVals.push([
          name,
          description,
          status || 'New',
          folderNameToIdMap[folder],
          url,
          Number(isKeyTask),
          creatorUserId,
          creatorUserId,
          status === 'Complete' ? 'CURRENT_TIMESTAMP' : null
        ]);
      }
    });

    const insertResult = await connection.query(
      `INSERT INTO tasks (name, description, status, folder_id, link_url, is_key_task, created_by_id, last_updated_by_id, date_completed)
       VALUES ?`,
      [taskInsertVals]
    );

    let insertId = insertResult[0].insertId;

    let taskTagsInsertVals = [];

    importRows.forEach(row => {
      const {
        tagsArray = []
      } = row;

      const taskId = insertId;

      tagsArray.forEach(tag => {
        taskTagsInsertVals.push([taskId, tagNameToIdMap[tag]]);
      });

      insertId++;
    });

    if (taskTagsInsertVals.length) {
      await connection.query(
        `INSERT INTO task_tags (task_id, tag_id) VALUES ?`,
        [taskTagsInsertVals]
      );
    }

    if (orgOwnerPlan === 'free') {
      cache.set(`org-${orgId}`, { ...cache.get(`org-${orgId}`), taskCount: orgTaskCount + taskInsertVals.length });
    }

    await connection.commit();

    connection.release();

    return res.json({
      success: true
    });

  } catch (error) {
    await connection.rollback();

    connection.release();
    next(error);
  }
};