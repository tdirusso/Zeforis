import { pool } from '../../database';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    tagId
  } = req.body;

  if (!tagId) {
    return res.json({
      message: 'Missing tag removal parameters.'
    });
  }

  try {
    await pool.query('DELETE FROM tags WHERE id = ?', [tagId]);

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};