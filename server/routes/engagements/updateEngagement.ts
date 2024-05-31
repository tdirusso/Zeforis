import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../../database';
import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '../../types/Errors';
import { Engagement, UpdateEngagementRequest } from '../../../shared/types/Engagement';
import { v4 as uuidv4 } from 'uuid';

const dbFieldsMapping = {
  'name': {
    databaseFieldName: 'name',
    databaseFieldType: 'string'
  },
  'isInviteLinkEnabled': {
    databaseFieldName: 'is_invite_link_enabled',
    databaseFieldType: 'boolean'
  }
};

type FieldKey = keyof typeof dbFieldsMapping;

export default async (req: Request<{}, {}, UpdateEngagementRequest>, res: Response<Engagement>) => {
  const updateRequestBody = req.body;

  const {
    engagement,
    engagement: { id: engagementId }
  } = req;

  if (Object.keys(updateRequestBody).length === 0) {
    throw new BadRequestError(`0 update fields provided - available fields: [${Object.keys(dbFieldsMapping).join(', ')}]`);
  }

  const fieldsToUpdate: string[] = [];
  const valuesToUpdate: any[] = [];
  const validationErrors: string[] = [];

  for (const field in dbFieldsMapping) {
    if (updateRequestBody[field as FieldKey] !== undefined) {
      const fieldMapping = dbFieldsMapping[field as FieldKey];
      const fieldValue = updateRequestBody[field as keyof UpdateEngagementRequest];

      if (typeof fieldValue === fieldMapping.databaseFieldType) {
        fieldsToUpdate.push(`${fieldMapping.databaseFieldName} = ?`);
        valuesToUpdate.push(fieldValue);
      } else {
        validationErrors.push(`Invalid type "${typeof fieldValue}" received for field "${field}".`);
      }
    }
  }

  if (fieldsToUpdate.length === 0) {
    throw new BadRequestError(`No valid fields were provided - available fields: [${Object.keys(dbFieldsMapping).join(', ')}]`);
  }

  if (validationErrors.length) {
    throw new BadRequestError('Received field errors.', validationErrors);
  }

  let inviteHash;

  if (updateRequestBody.isInviteLinkEnabled) {
    inviteHash = uuidv4().substring(0, 36);
    fieldsToUpdate.push('invite_link_hash = ?', 'is_invite_link_enabled = ?');
    valuesToUpdate.push(inviteHash, true);
  } else if (updateRequestBody.isInviteLinkEnabled === false) {
    fieldsToUpdate.push('invite_link_hash = ?', 'is_invite_link_enabled = ?');
    valuesToUpdate.push(null, false);
  }

  const updateClause = fieldsToUpdate.join(', ');

  const query = `UPDATE engagements SET ${updateClause} WHERE id = ?`;
  const params = [...valuesToUpdate, engagementId];

  const [updateResult] = await pool.query<ResultSetHeader>(query, params);

  const [engagementResult] = await pool.query<RowDataPacket[]>(`
    SELECT 
    name,
    id,
    is_invite_link_enabled AS isInviteLinkEnabled,
    invite_link_hash AS inviteLinkHash
    FROM engagements
    WHERE id = ?
  `, [engagementId]);

  if (updateResult.affectedRows) {
    return res.json({
      id: engagementResult[0].id,
      name: engagementResult[0].name,
      isInviteLinkEnabled: engagementResult[0].isInviteLinkEnabled,
      inviteLinkHash: engagementResult[0].inviteLinkHash
    });
  }

  throw new NotFoundError(`Engagement with id ${engagementId} not found.`);
};