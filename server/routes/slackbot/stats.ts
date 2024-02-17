import { pool } from '../../database';
import { Request, Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2';

export default async (_: Request, res: Response, next: NextFunction) => {

  const connection = await pool.getConnection();

  try {
    const [usersCountResult] = await connection.query<RowDataPacket[]>('SELECT COUNT(id) AS count FROM users');
    const [engagementsCountResult] = await connection.query<RowDataPacket[]>('SELECT COUNT(id) AS count FROM engagements');
    const [tasksCountResult] = await connection.query<RowDataPacket[]>('SELECT COUNT(id) AS count FROM tasks');

    const botMessage = `
      *Current Zeforis Statistics*

      🙋🏼‍♂️ ${usersCountResult[0].count.toLocaleString()} Users\n
      📋 ${engagementsCountResult[0].count.toLocaleString()} Engagements\n
      ✅ ${tasksCountResult[0].count.toLocaleString()} Tasks
    `;

    connection.release();

    return res.end(botMessage);
  } catch (error) {
    connection.release();
    next(error);
  }
};