import crypto from 'crypto';
import { EnvVariable, getEnvVariable } from '../types/EnvVariable';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const slackSignature = req.headers['x-slack-signature'];
  const slackTimestamp = req.headers['x-slack-request-timestamp'];
  const rawBody = req.rawBody;

  if (!slackSignature || !slackTimestamp || !rawBody) {
    return res.json({
      message: 'Unauthorized request.'
    });
  }

  try {
    const rawBodyString = Buffer.from(rawBody).toString();

    const signatureBase = `v0:${slackTimestamp}:${rawBodyString}`;

    const computedHash = crypto
      .createHmac('sha256', getEnvVariable(EnvVariable.SLACK_SIGNING_SECRET))
      .update(signatureBase)
      .digest('hex');

    if (`v0=${computedHash}` === slackSignature) {
      return next();
    }

    return res.json({
      message: 'Unauthorized request.'
    });
  } catch (error) {
    next(error);
  }
};