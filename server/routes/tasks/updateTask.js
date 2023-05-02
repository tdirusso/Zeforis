const pool = require('../../../database');

module.exports = async (req, res) => {
  const {
    name,
    description,
    status = 'New',
    folderId,
    linkUrl,
    assignedToId = null,
    tags = [],
    isKeyTask = false,
    dueDate,
    taskId,
    currentTags = []
  } = req.body;

  let { progress = 0 } = req.body;

  const creatorUserId = req.userId;

  if (!name || !folderId || !creatorUserId) {
    return res.json({
      message: 'Missing task parameters.'
    });
  }

  try {
    if (status === 'Complete') {
      progress = 100;
    }

    const [updatedTaskResult] = await pool.query(
      `
        UPDATE tasks SET 
            name = ?,
            description = ?,
            status = ?,
            folder_id = ?,
            link_url = ?,
            assigned_to_id = ?,
            progress = ?,
            is_key_task = ?,
            date_due = ?,
            last_updated_by_id = ?
         WHERE id = ? 
      `,
      [name, description, status, folderId, linkUrl, assignedToId, progress, isKeyTask, dueDate, creatorUserId, taskId]
    );

    if (updatedTaskResult.affectedRows) {
      const removedTags = currentTags.filter(tag => {
        return !tags.some(t => t.id === tag.id);
      });

      const addedTags = tags.filter(tag => {
        return !currentTags.some(t => t.id === tag.id);
      });

      if (removedTags.length) {
        await pool.query('DELETE FROM task_tags WHERE task_id = ? AND tag_id IN (?)',
          [taskId, removedTags.map(t => t.id)]
        );
      }

      if (addedTags.length) {
        const insertValues = addedTags.map(tag => [tag.id, taskId]);

        await pool.query(
          'INSERT INTO task_tags (tag_id, task_id) VALUES ?',
          [insertValues]
        );
      }

      return res.json({ success: true });
    }

    return res.json({ message: 'Task not found.' });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};