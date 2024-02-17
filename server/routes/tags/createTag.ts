import { pool } from '../../database';
import { Request, Response, NextFunction } from 'express';
import { ResultSetHeader } from 'mysql2';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    name
  } = req.body;

  const { engagementId } = req;

  if (!engagementId || !name) {
    return res.json({
      message: 'Missing tag parameters.'
    });
  }

  try {
    const newTag = await pool.query<ResultSetHeader>(
      'INSERT INTO tags (name, engagement_id) VALUES (?,?)',
      [name, engagementId]
    );

    const newTagId = newTag[0].insertId;

    const tagObject = {
      name,
      id: newTagId,
      engagement_id: engagementId
    };

    return res.json({
      success: true,
      tag: tagObject
    });
  } catch (error) {
    next(error);
  }
};