import { ResultSetHeader } from 'mysql2';
import { pool } from '../../database';
import { createJWT } from '../../lib/utils';
const validFieldMappings = require('../../database').apiFieldMappings.users;
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;
  const { userId } = req.params;
  const updateFields = req.body;

  const userIdParam = Number(userId);

  if (isNaN(userIdParam)) {
    return res.json({ message: `Invalid userId provided: ${userId} - must be a number.` });
  }

  if (Object.keys(updateFields).length === 0) {
    return res.json({ message: `No fields were provided.  Available fields: ${Object.keys(validFieldMappings).join(', ')}` });
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

    if (fieldUpdates.length === 0) {
      return res.json({ message: `No valid fields were provided.  Available fields: ${Object.keys(validFieldMappings).join(', ')}` });
    }

    const updateClause = fieldUpdates.join(', ');

    const query = `UPDATE users SET ${updateClause} WHERE id = ?`;
    const params = [...updateValues, userId];

    const [updateResult] = await pool.query<ResultSetHeader>(query, params);

    if (updateResult.affectedRows) {
      return res.json({
        success: true,
        token: createJWT({ ...user })
      });
    }

    return res.json({ message: 'User not found.' });
  } catch (error) {
    next(error);
  }
};