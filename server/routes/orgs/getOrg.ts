import { pool } from '../../database';
import { Request, Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    orgId
  } = req.query;

  if (!orgId) {
    return res.json({
      message: 'Missing orgId.'
    });
  }

  try {
    const [orgResult] = await pool.query<RowDataPacket[]>(
      'SELECT name, brand_color as brandColor, logo_url as logo FROM orgs WHERE id = ?',
      [orgId]
    );

    const org = orgResult[0];

    if (org) {
      return res.json({
        org
      });
    }

    return res.json({
      error: 'Org does not exist.'
    });
  } catch (error) {
    next(error);
  }
};