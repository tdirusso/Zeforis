import { TokenExpiredError } from "jsonwebtoken";
import { pool } from '../database';
import slackbot from '../slackbot';
import { isDev } from '../config';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError, UnauthorizedError, UnprocessableError } from "../types/Errors";

export default async function errorHandler(error: unknown, _: Request, res: Response, __: NextFunction) {
  if (error instanceof Error) {
    switch (true) {
      case error instanceof BadRequestError:
        return res.status(400).json({ message: error.message });
      case error instanceof TokenExpiredError:
        return res.status(401).json({ message: 'Session expired (token expired).' });
      case error instanceof UnauthorizedError:
        return res.status(401).json({ message: `${error.message}` });
      case error instanceof ForbiddenError:
        return res.status(403).json({ message: `${error.message}` });
      case error instanceof NotFoundError:
        return res.status(404).json({ message: error.message });
      case error instanceof ConflictError:
        return res.status(409).json({ message: error.message });
      case error instanceof UnprocessableError:
        return res.status(422).json({ message: error.message });
      default:
        console.error('Application error:', error);
        await handleServerError(error);
        break;
    }
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