import { pool } from '../../database';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const orgId = req.ownedOrg.id;

  if (!orgId) {
    return res.json({
      message: 'Missing engagementId.'
    });
  }

  try {
    await pool.query('DELETE FROM orgs WHERE id = ?', [orgId]);

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};