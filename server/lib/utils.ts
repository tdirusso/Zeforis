import jwt from 'jsonwebtoken';
import stripe from '../stripe';
import { commonQueries } from '../database';
import type { RowDataPacket } from 'mysql2';
import type { PoolConnection } from 'mysql2/promise';
import { getEnvVariable, EnvVariable } from '../types/EnvVariable';
import { Request, Response } from 'express';
import { isDev } from '../config';

type RequestBody = {
  [key: string]: any;
};

type FrontendFieldMappings = {
  email: string;
  firstName: string;
  lastName: string;
};

function createJWT(userId: number) {
  return jwt.sign(
    { userId },
    getEnvVariable(EnvVariable.SECRET_KEY),
    { expiresIn: 36000 }
  );
}

function setAuthTokenCookie(token: string, res: Response) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: !isDev,
    sameSite: 'lax',
    maxAge: 36000000 // 10 hours
  });
}

function getAuthToken(req: Request) {
  return req.cookies.token;
}

function getRequestParameter(parameterName: string, req: Request) {
  let value;

  value = req.body[parameterName];

  if (!value) {
    value = req.query[parameterName];
  }

  if (!value) {
    value = req.params[parameterName];
  }

  return value;
}

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateStripeSubscription(con: PoolConnection, userId: number, orgId: number) {
  const [customerIdResult] = await con.query<RowDataPacket[]>('SELECT stripe_customerId FROM users WHERE id = ?', [userId]);
  const customerId = customerIdResult[0].stripe_customerId;

  if (!customerId) {
    return { message: 'No customerId was found.' };
  }

  const subscriptions = (await stripe.subscriptions.list({
    customer: customerId
  })).data;

  const activeSubscription = subscriptions.find(sub => sub.status === 'active');
  const pastDueSubscription = subscriptions.find(sub => sub.status === 'past_due');

  if (!activeSubscription) {
    if (pastDueSubscription) {
      return { message: 'Your subscription is past due.  Please update your subscription from account settings and try again.' };
    } else {
      return { message: 'No active subscription was found.  You can manage/create a subscription from account settings.' };
    }
  }

  const orgAdminCount = await commonQueries.getOrgAdminCount(con, orgId);

  await stripe.subscriptions.update(
    activeSubscription.id,
    {
      proration_behavior: 'none',
      items: [
        {
          id: activeSubscription.items.data[0].id,
          quantity: orgAdminCount
        },
      ],
    }
  );

  return { success: true };
}

const frontendFieldMappings: FrontendFieldMappings = {
  email: 'Email',
  firstName: 'First name',
  lastName: 'Last name',
};

const getMissingFields = (requiredFields: (keyof FrontendFieldMappings)[], requestBody: RequestBody, useFrontEndMappings = false) => {
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!requestBody[field]) {
      missingFields.push(useFrontEndMappings ? frontendFieldMappings[field] : field);
    }
  }

  return missingFields;
};

export {
  createJWT,
  updateStripeSubscription,
  getMissingFields,
  wait,
  getAuthToken,
  getRequestParameter,
  setAuthTokenCookie
};