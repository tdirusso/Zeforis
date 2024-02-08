const { pool } = require('../../database');
const slackbot = require('../../slackbot');
const { isDev } = require('../../config');

module.exports = async (req, res, next) => {

  const {
    errorStack,
    componentStack
  } = req.body;

  try {
    if (!isDev) {
      const logData = `${errorStack} \n\n--- Component Stack --- \n\n ${componentStack}`;

      await pool.query(
        'INSERT INTO app_logs (type, data) VALUES ("frontend-error", ?)',
        [logData]
      );

      await slackbot.post({
        channel: slackbot.channels.errors,
        message: `*Frontend Error*\n${logData}`
      });
    }

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};