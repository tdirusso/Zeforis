import { RowDataPacket } from 'mysql2';
import { pool } from '../../database';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    engagementId
  } = req.body;

  if (!engagementId) {
    return res.json({
      message: 'No engagement ID supplied.'
    });
  }

  if (!name) {
    return res.json({
      message: 'Missing engagement name.'
    });
  }

  try {
    const [engagementResult] = await pool.query<RowDataPacket[]>(
      'SELECT org_id FROM engagements WHERE id = ?',
      [engagementId]
    );

    const engagement = engagementResult[0];

    if (engagement) {
      await pool.query(
        'UPDATE engagements SET name = ? WHERE id = ?',
        [name, engagementId]
      );

      return res.json({
        success: true
      });
    }

    return res.json({ message: 'Engagement does not exist.' });
  } catch (error) {
    next(error);
  }
};