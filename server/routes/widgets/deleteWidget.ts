import { pool } from '../../database';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    widgetId
  } = req.body;

  if (!widgetId) {
    return res.json({
      message: 'Missing widgetId.'
    });
  }

  try {
    await pool.query('DELETE FROM widgets WHERE id = ?', [widgetId]);

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};