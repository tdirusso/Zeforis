import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../../database';
import { createJWT, setAuthTokenCookie } from '../../lib/utils';
import { Request, Response } from 'express';
import { UpdateUserRequest } from '../../../shared/types/api/User';
import { BadRequestError, NotFoundError } from '../../types/Errors';
import { Org } from '../../../shared/types/Org';
import { User } from '../../../shared/types/User';

const dbFieldsMapping = {
  'firstName': {
    databaseFieldName: 'first_name',
    databaseFieldType: 'string'
  },
  'lastName': {
    databaseFieldName: 'last_name',
    databaseFieldType: 'string'
  }
};

type FieldKey = keyof typeof dbFieldsMapping;
type UserIdRequestParam = { userId?: { userId: string; }; };

export default async (req: Request<UserIdRequestParam, {}, UpdateUserRequest>, res: Response<User>) => {
  const { user } = req;
  const { userId } = req.params;
  const updateRequestBody = req.body;

  if (Object.keys(updateRequestBody).length === 0) {
    throw new BadRequestError(`0 update fields provided - available fields: ${Object.keys(dbFieldsMapping).join(', ')}`);
  }

  const fieldsToUpdate: string[] = [];
  const valuesToUpdate: any[] = [];
  const validationErrors: string[] = [];

  for (const field in dbFieldsMapping) {
    if (updateRequestBody[field as FieldKey]) {
      const fieldMapping = dbFieldsMapping[field as FieldKey];
      const fieldValue = updateRequestBody[field as keyof UpdateUserRequest];

      if (typeof fieldValue === fieldMapping.databaseFieldType) {
        fieldsToUpdate.push(`${fieldMapping.databaseFieldName} = ?`);
        valuesToUpdate.push(fieldValue);
      } else {
        validationErrors.push(`Invalid type "${typeof fieldValue}" received for field "${field}".`);
      }
    }
  }

  if (fieldsToUpdate.length === 0) {
    throw new BadRequestError(`No valid fields were provided - available fields: ${Object.keys(dbFieldsMapping).join(', ')}`);
  }

  if (validationErrors.length) {
    throw new BadRequestError(validationErrors.join('\n'));
  }

  const updateClause = fieldsToUpdate.join(', ');

  const query = `UPDATE users SET ${updateClause} WHERE id = ?`;
  const params = [...valuesToUpdate, userId];

  const [updateResult] = await pool.query<ResultSetHeader>(query, params);

  if (updateResult.affectedRows) {
    const [userDataResult] = await pool.query<[RowDataPacket[], Org[] & RowDataPacket[]]>('CALL getUserData(?)', [userId]);

    const [planData, orgData] = userDataResult;

    const userObect: User = { ...user, ...planData };

    const newToken = createJWT({ ...user });
    setAuthTokenCookie(newToken, res);

    return res.json({
      ...userObect,
      orgs: orgData,
    });
  }

  throw new NotFoundError(`User with id ${userId} not found.`);
};