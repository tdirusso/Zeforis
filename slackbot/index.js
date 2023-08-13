const { WebClient } = require('@slack/web-api');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

const slackbotClient = new WebClient(process.env.SLACK_BOT_OAUTH_TOKEN);

module.exports = {
  slackbotClient
};

