import { pool } from '../../database';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    engagementId
  } = req.body;

  if (!engagementId) {
    return res.json({
      message: 'Missing engagementId.'
    });
  }

  try {
    await pool.query('DELETE FROM engagements WHERE id = ?', [engagementId]);

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};