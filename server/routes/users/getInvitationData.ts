import { RowDataPacket } from 'mysql2';
import { pool } from '../../database';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    userId,
    engagementId,
    invitationCode
  } = req.query;

  if (!engagementId || !userId || !invitationCode) {
    return res.json({
      message: 'Missing invitation params.'
    });
  }

  const connection = await pool.getConnection();

  try {
    const [invitationResult] = await connection.query<RowDataPacket[]>(
      'SELECT user_id FROM engagement_users WHERE engagement_id = ? AND user_id = ? AND invitation_code = ?',
      [engagementId, userId, invitationCode]
    );

    const invitation = invitationResult[0];

    if (!invitation) {
      connection.release();
      return res.json({
        message: 'No invitation found.'
      });
    }

    const [userResult] = await connection.query<RowDataPacket[]>(
      'SELECT id, email, first_name as firstName, last_name as lastName FROM users WHERE id = ?',
      [userId]
    );

    const user = userResult[0];

    if (!user) {
      connection.release();
      return res.json({
        message: 'No invitation found.'
      });
    }

    const userNeedsName = Boolean(!user.firstName && !user.lastName);

    await connection.query(
      'UPDATE engagement_users SET invitation_code = NULL WHERE engagement_id = ? AND user_id = ? AND invitation_code = ?',
      [engagementId, userId, invitationCode]
    );


    connection.release();

    return res.json({
      invitation: {
        userNeedsName
      }
    });
  } catch (error) {
    connection.release();
    next(error);
  }
};