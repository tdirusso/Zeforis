const { pool } = require('../../../database');
const { slackbotClient } = require('../../../slackbot');
const { isDev } = require('../../../config');

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

      await slackbotClient.chat.postMessage({
        text: `*Zeforis Frontend Error*\n${logData}`,
        channel: 'C05MNK33N7N'
      });

    }

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};