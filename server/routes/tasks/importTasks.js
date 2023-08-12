const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    engagementId,
    importRows = []
  } = req.body;

  const creatorUserId = req.userId;

  if (!engagementId || !importRows.length === 0) {
    return res.json({
      message: 'Missing import parameters.'
    });
  }

  const connection = await pool.getConnection();

  try {
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
        status = 'New',
        folder,
        url = '',
        isKeyTask = false
      } = row;

      if (name && folder) {
        taskInsertVals.push([
          name,
          description,
          status,
          folderNameToIdMap[folder],
          url,
          isKeyTask,
          creatorUserId,
          creatorUserId
        ]);
      }
    });

    const insertResult = await connection.query(
      `INSERT INTO tasks (name, description, status, folder_id, link_url, is_key_task, created_by_id, last_updated_by_id)
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

    await connection.query(
      `INSERT INTO task_tags (task_id, tag_id) VALUES ?`,
      [taskTagsInsertVals]
    );

    connection.release();

    return res.json({
      success: true
    });

  } catch (error) {
    console.log(error);

    connection.release();

    return res.json({
      message: error.message
    });
  }
};