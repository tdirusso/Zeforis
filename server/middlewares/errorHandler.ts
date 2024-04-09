import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { pool } from '../database';
import slackbot from '../slackbot';
import { isDev } from '../config';
import { NextFunction, Request, Response } from 'express';
import { APIError, APIErrorData } from "../types/Errors";

type APIErrorResponse = {
  message: string,
  errors?: APIErrorData;
};

export default async function errorHandler(error: unknown, _: Request, res: Response, __: NextFunction) {
  if (error instanceof APIError) {
    const errorResponse: APIErrorResponse = { message: error.message };
    if (error.errors) {
      errorResponse.errors = error.errors;
    }

    return res.status(error.statusCode).json(errorResponse);
  } else if (error instanceof JsonWebTokenError) {
    return res.status(400).json({ message: error.message });
  } else if (error instanceof TokenExpiredError) {
    return res.status(401).json({ message: 'Session expired (token expired).' });
  } else if (error instanceof Error) {
    console.error('Application error:', error);
    await handleServerError(error);
  } else {
    console.error('Non-Error object received:', error);
    await handleNonError(error);
  }

  return res.status(500).json({
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : null,
    message: 'Something went wrong...',
  });
}


async function handleServerError(error: Error) {
  try {
    if (!isDev) {
      const stack = error.stack || 'No stack trace available';
      await logToDatabase('handled-error', stack);
      await notifyErrorToSlack('Server Error', stack);
    }
  } catch (newError) {
    console.error('Error handling error:', newError);
  }
}

async function handleNonError(error: unknown) {
  try {
    if (!isDev) {
      await logToDatabase('handled-something', String(error));
      await notifyErrorToSlack('Server Error (NOT instanceof Error)', String(error));
    }
  } catch (newError) {
    console.error('Error handling non-error:', newError);
  }
}

async function logToDatabase(type: string, data: string) {
  await pool.query('INSERT INTO app_logs (type, data) VALUES (?, ?)', [type, data]);
}

async function notifyErrorToSlack(title: string, message: string) {
  await slackbot.post({
    channel: slackbot.channels.errors,
    message: `*${title}*\n${message}`
  });
}