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
        (name, description, status, folder_id, link_url, assigned_to_id, progress, created_by_id, is_key_task, date_due) 
        VALUES
        (?,?,?,?,?,?,?,?,?,?)`,
      [name, description, status, folderId, linkUrl, assignedToId, progress, creatorUserId, isKeyTask, dueDate]
    );

    const newTaskId = newTask[0].insertId;

    if (tags.length) {
      const insertValues = tags.map(tag => [tag.id, newTaskId]);

      await pool.query(
        'INSERT INTO task_tags (tag_id, task_id) VALUES ?',
        [insertValues]
      );
    }

    return res.json({
      success: true,
      id: newTask[0].insertId
    });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};