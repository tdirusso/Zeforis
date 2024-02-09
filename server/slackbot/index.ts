import { WebClient } from '@slack/web-api';
import { EnvVariable, getEnvVariable } from '../types/EnvVariable';

class Slackbot {
  client = new WebClient(getEnvVariable(EnvVariable.SLACK_BOT_OAUTH_TOKEN));
  channels = {
    errors: 'C05MNK33N7N',
    events: 'C05ML3A3DC3'
  };

  constructor() { }

  async post({ channel, message }: { channel: string, message: string; }) {
    await this.client.chat.postMessage({
      text: message,
      channel
    });
  }
}

export default new Slackbot()

