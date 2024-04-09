import emailService from '../../email';
import validator from "email-validator";
import { pool, commonQueries } from '../../database';
import { updateStripeSubscription } from '../../lib/utils';
import { Request, Response, NextFunction } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { CreateInvitationsRequest, CreateInvitationsResponse } from '../../../shared/types/Invitation';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError, ServerError } from '../../types/Errors';

type EngagementIdRequestParam = { engagementId?: string; };

const validRoles = new Set(['admin', 'member']);
const validRolesString = `[${Array.from(validRoles).join(', ')}]`;

export default async (req: Request<EngagementIdRequestParam, {}, CreateInvitationsRequest>, res: Response<CreateInvitationsResponse>, next: NextFunction) => {
  const {
    users = []
  } = req.body;

  const { engagementId } = req.params;

  const {
    id: orgId,
    name: orgName,
    logo: orgLogo,
    brandColor: orgColor
  } = req.org;

  const requestingUserId = req.userId;

  if (!engagementId) {
    throw new BadRequestError('Missing required parameter /{engagementId}/.');
  }

  if (!users.length) {
    throw new BadRequestError(`[users] is empty.`);
  }

  if (users.length >= 20) {
    throw new BadRequestError('[users] must contain less than 20 entries.');
  }

  const connection = await pool.getConnection();

  const [requestingUserResult] = await connection.query<RowDataPacket[]>('SELECT email FROM users WHERE id = ?', [requestingUserId]);

  const containsSelf = users.some(user => user.email?.toLowerCase() === requestingUserResult[0].email);

  if (containsSelf) {
    throw new BadRequestError(`Cannot invite self (${requestingUserResult[0].email})`);
  }

  const hasAdmins = users.some(user => user.role === 'admin');
  if (hasAdmins) {
    const orgOwnerPlan = await commonQueries.getOrgOwnerPlan(connection, orgId);
    if (orgOwnerPlan === 'free') {
      throw new ForbiddenError('Cannot add administrators - upgrade required.');
    }
  }

  const invalidOrMissingFields: string[] = [];
  const allEmails: string[] = [];

  users.forEach((user, index) => {
    const email = user.email?.toLowerCase();
    const role = user.role;

    if (!email || !validator.validate(email)) {
      invalidOrMissingFields.push(`Invalid/missing email at index ${index}: ${email}`);
    } else if (!role || !validRoles.has(role)) {
      invalidOrMissingFields.push(`Invalid/missing role at index ${index}:  ${role}.   Valid values are:  ${validRolesString}`);
    } else {
      allEmails.push(email);
    }
  });

  if (invalidOrMissingFields.length) {
    throw new BadRequestError(`Received errors for [users].`, invalidOrMissingFields);
  }

  const [engagementResult] = await connection.query<RowDataPacket[]>('SELECT name FROM engagements WHERE id = ?', [engagementId]);

  if (!engagementResult.length) {
    throw new NotFoundError(`Engagement with id ${engagementId} not found.`);
  }

  const [existingEngagementUsersResult] = await connection.query<RowDataPacket[]>(`
    SELECT users.email 
    FROM engagement_users
    LEFT JOIN users ON users.id = engagement_users.user_id
    WHERE 
    engagement_id = ? 
    AND users.email IN (?)`,
    [engagementId, allEmails]
  );

  if (existingEngagementUsersResult.length) {
    throw new ConflictError(`The following users are already members of this engagement:  ${existingEngagementUsersResult.map(user => user.email).join(', ')}`);
  }

  await connection.beginTransaction();

  try {
    const [existingUsersResult] = await connection.query<RowDataPacket[]>(
      'SELECT email FROM users WHERE email IN (?)',
      [allEmails]
    );

    const existingUsersEmails = existingUsersResult.map(user => user.email);

    const newEmails = allEmails.filter(email => !existingUsersEmails.includes(email));

    if (newEmails.length) {
      await connection.query<ResultSetHeader>(
        'INSERT INTO users (email) VALUES ?',
        [newEmails.map(email => [email])]
      );
    }

    await emailService.sendInvitationEmails(Number(engagementId), orgName, engagementResult[0].name, orgColor, orgLogo || null, users, connection);

    if (hasAdmins) {
      const { success, message } = await updateStripeSubscription(connection, requestingUserId, orgId);

      if (!success) {
        await connection.rollback();
        connection.release();

        throw new ServerError(message || 'Error while updating your subscription.');
      }
    }

    await connection.commit();

    connection.release();

    return res.status(201).json({
      usersInvited: users.map(user => {
        return {
          email: user.email.toLowerCase(),
          status: 'pending'
        };
      })
    });
  } catch (error) {
    await connection.rollback();

    connection.release();
    next(error);
  }
};