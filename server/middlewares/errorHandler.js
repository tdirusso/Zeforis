const { TokenExpiredError } = require("jsonwebtoken");
const { pool } = require('../../database');
const slackbot = require('../../slackbot');

const { isDev } = require('../../config');

module.exports = async (error, __, res, _) => {
  if (!(error instanceof TokenExpiredError || error.message?.includes('Range Not Satisfiable'))) {
    console.error('Application error:  ', error);

    if (!isDev) {
      try {
        await pool.query(
          'INSERT INTO app_logs (type, data) VALUES ("handled-error", ?)',
          [error.stack]
        );

        await slackbot.post({
          channel: slackbot.channels.errors,
          message: `*Server Error*\n${error.stack}`
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