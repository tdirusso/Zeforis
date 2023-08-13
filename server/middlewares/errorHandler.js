const { TokenExpiredError } = require("jsonwebtoken");
const { pool } = require('../../database');
const { slackbotClient } = require('../../slackbot');

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (error, req, res, _) => {
  if (!(error instanceof TokenExpiredError)) {
    console.error('Application error:  ', error);

    if (!isDev) {
      try {
        await pool.query(
          'INSERT INTO app_logs (type, data) VALUES (?,?)',
          ['handled-error', error.stack]
        );

        await slackbotClient.chat.postMessage({
          text: `*New Zeforis Error*\n${error.stack}`,
          channel: 'C05MNK33N7N'
        });

      } catch (newError) {
        console.log('Error handling error:  ', newError);
      }
    }
  }

  return res.json({
    error: true,
    message: error.message
  });
};