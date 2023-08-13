const { WebClient } = require('@slack/web-api');

const slackbotClient = new WebClient(process.env.SLACK_BOT_OAUTH_TOKEN);

module.exports = {
  slackbotClient
};

