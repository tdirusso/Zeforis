import { pool } from '../../database';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    tagId
  } = req.body;

  if (!name || !tagId) {
    return res.json({
      message: 'Missing tag parameters.'
    });
  }

  try {
    await pool.query(
      'UPDATE tags SET name = ? WHERE id = ?',
      [name, tagId]
    );

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};