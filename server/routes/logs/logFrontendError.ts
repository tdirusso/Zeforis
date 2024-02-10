import { pool } from '../../database';
import slackbot from '../../slackbot';
import { isDev } from '../../config';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {

  const {
    errorStack,
    componentStack
  } = req.body;

  try {
    if (!isDev) {
      const logData = `${errorStack} \n\n--- Component Stack --- \n\n ${componentStack}`;

      await pool.query(
        'INSERT INTO app_logs (type, data) VALUES ("frontend-error", ?)',
        [logData]
      );

      await slackbot.post({
        channel: slackbot.channels.errors,
        message: `*Frontend Error*\n${logData}`
      });
    }

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};