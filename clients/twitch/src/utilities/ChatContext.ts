import { Client, ChatUserstate } from 'tmi.js';

export class ChatContext
{
  public client: Client;
  public channel: string;
  public tags: ChatUserstate;
  public message: string;

  constructor(client: Client, channel: string, tags: ChatUserstate, message: string)
  {
    this.client = client;
    this.channel = channel;
    this.tags = tags;
    this.message = message;
  }

  send(message: any, noMention?: boolean)
  {
    this.client.say(
      this.channel,
      noMention ? message.toString() : `@${this.tags.username} ${message}`,
    );
  }
}
