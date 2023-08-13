const crypto = require('crypto');

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = (req, res, next) => {
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
      .createHmac('sha256', process.env.SLACK_SIGNING_SECRET)
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