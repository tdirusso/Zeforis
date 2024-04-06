import { pool } from '../../database';
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { User } from '../../../shared/types/User';
import { Org } from '../../../shared/types/Org';
import { NotFoundError } from '../../types/Errors';

export default async (req: Request, res: Response<User>) => {

  const requestingUserId = req.userId;

  const [userDataResult] = await pool.query<[User[] & RowDataPacket[], Org[] & RowDataPacket[]]>(
    'CALL getUserData(?)',
    [requestingUserId]);

  const [userData, orgData] = userDataResult;

  if (!userData.length) {
    throw new NotFoundError(`User with id ${requestingUserId} not found.`);
  }

  const user: User = {
    ...userData[0],
    orgs: orgData
  };

  return res.json(user);
};