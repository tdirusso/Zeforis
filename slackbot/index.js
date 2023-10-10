const { WebClient } = require('@slack/web-api');

class Slackbot {
  constructor() {
    if (this.client) {
      return this;
    }

    this.client = new WebClient(process.env.SLACK_BOT_OAUTH_TOKEN);

    this.channels = {
      errors: 'C05MNK33N7N',
      events: 'C05ML3A3DC3'
    };
  }

  async post({ channel, message }) {
    await this.client.chat.postMessage({
      text: message,
      channel
    });
  }
}

const slackbot = new Slackbot();

module.exports = slackbot

