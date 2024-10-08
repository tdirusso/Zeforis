import { pool } from '../../database';
import { Request, Response, NextFunction } from 'express';
import { ResultSetHeader } from 'mysql2';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    body = '',
    isEnabled = 0,
    backgroundColor = '#ffffff',
  } = req.body;

  const { engagementId } = req;

  if (!name) {
    return res.json({
      message: 'Missing widget name.'
    });
  }

  try {
    const newWidget = await pool.query<ResultSetHeader>(
      `INSERT INTO widgets 
        (
          engagement_id,
          name,
          body, 
          is_enabled, 
          background_color
        ) 
        VALUES
        (?,?,?,?,?)`,
      [engagementId, name, body, isEnabled, backgroundColor]
    );

    const newWidgetId = newWidget[0].insertId;

    const widgetObject = {
      id: newWidgetId,
      engagementId,
      name,
      body,
      isEnabled,
      backgroundColor
    };

    return res.json({
      success: true,
      widget: widgetObject
    });
  } catch (error) {
    next(error);
  }
};