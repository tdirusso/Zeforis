import { pool } from '../../database';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    folderId
  } = req.body;

  if (!folderId) {
    return res.json({
      message: 'Missing folderId.'
    });
  }

  try {
    await pool.query('DELETE FROM folders WHERE id = ?', [folderId]);

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};