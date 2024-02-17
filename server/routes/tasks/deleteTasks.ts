import { pool } from '../../database';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    taskIds
  } = req.body;

  if (!taskIds || taskIds.length === 0) {
    return res.json({
      message: 'Missing taskId.'
    });
  }

  try {
    await pool.query('DELETE FROM tasks WHERE id IN (?)', [taskIds]);

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};