const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    name,
    description = '',
    status = 'New',
    folderId,
    linkUrl,
    assignedToId = null,
    tags = [],
    isKeyTask = false,
    dueDate = null
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
          created_by_id,
          is_key_task,
          date_due, 
          last_updated_by_id
        ) 
        VALUES
        (?,?,?,?,?,?,?,?,?,?)`,
      [name, description, status, folderId, linkUrl, assignedToId, creatorUserId, isKeyTask, dueDate, creatorUserId]
    );

    const newTaskId = newTask[0].insertId;

    if (tags.length) {
      const insertValues = tags.map(tag => [tag.id, newTaskId]);

      await pool.query(
        'INSERT INTO task_tags (tag_id, task_id) VALUES ?',
        [insertValues]
      );
    }

    const taskObject = {
      id: newTask,
      name,
      description,
      status,
      folderId,
      linkUrl,
      assignedToId,
      tags,
      isKeyTask,
      dueDate
    };

    return res.json({
      success: true,
      task: taskObject
    });
  } catch (error) {
    console.log(error);

    return res.json({
      error: true,
      message: error.message
    });
  }
};