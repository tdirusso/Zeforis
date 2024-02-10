import { pool } from '../../database';
import { Request, Response, NextFunction } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    name
  } = req.body;

  const creatorUserId = req.userId;

  if (!creatorUserId) {
    return res.json({
      message: 'Missing userId.'
    });
  }

  if (!name) {
    return res.json({
      message: 'Missing organization name.'
    });
  }

  try {

    const [ownedOrg] = await pool.query<RowDataPacket[]>('SELECT name FROM orgs WHERE owner_id = ?', [creatorUserId]);

    if (ownedOrg.length) {
      return res.json({
        message: `You already own an organization (${ownedOrg[0].name})`
      });
    }

    const newOrg = await pool.query<ResultSetHeader>(
      'INSERT INTO orgs (name, owner_id, brand_color) VALUES (?,?, "#3365f6")',
      [name, creatorUserId]
    );

    return res.json({ orgId: newOrg[0].insertId });
  } catch (error) {
    next(error);
  }
};