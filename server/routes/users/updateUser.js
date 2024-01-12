const { pool } = require('../../../database');
const { createJWT } = require('../../../lib/utils');
const validFieldMappings = require('../../../database').apiFieldMappings.users;

module.exports = async (req, res, next) => {
  const { userId, userObject } = req;
  const updateFields = req.body;

  if (Object.keys(updateFields).length === 0) {
    return res.json({ message: `No valid fields were provided.  Available fields: ${Object.keys(validFieldMappings).join(', ')}` });
  }

  if (!userId) {
    return res.json({ message: 'Missing userId.' });
  }

  try {
    const fieldUpdates = [];
    const updateValues = [];

    for (const field in updateFields) {
      if (validFieldMappings[field]) {
        fieldUpdates.push(`${validFieldMappings[field]} = ?`);
        updateValues.push(updateFields[field]);
      }
    }

    if (fieldUpdates.length > 0) {
      return res.json({ message: `No valid fields were provided.  Available fields: ${Object.keys(validFieldMappings).join(', ')}` });
    }

    const updateClause = fieldUpdates.join(', ');

    const query = `UPDATE users SET ${updateClause} WHERE id = ?`;
    const params = [...updateValues, userId];

    const [updateResult] = await pool.query(query, params);

    if (updateResult.affectedRows) {
      return res.json({
        success: true,
        token: createJWT({ ...userObject })
      });
    }

    return res.json({ message: 'User not found.' });
  } catch (error) {
    next(error);
  }
};