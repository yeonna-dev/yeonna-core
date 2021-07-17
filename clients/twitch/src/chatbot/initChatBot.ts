import { Client } from 'tmi.js';
import { Comtroller } from 'comtroller';

import { loadNamedModules } from '../utilities/helpers';
import { ChatContext } from '../utilities/ChatContext';
import { Log } from '../utilities/logger';

/* Bot account username and password. */
const username = process.env.TWITCH_USERNAME;
const password = process.env.TWITCH_PASSWORD;

export const client = new Client({
  connection: { secure: true, reconnect: true },
  identity: { username, password },
  channels: process.env.TWITCH_CHANNELS?.split(',') || [],
});

export async function initChatBot()
{
	const commands = await loadNamedModules(`${__dirname}/commands`);
	const comtroller = new Comtroller({
		commands,
		defaults: { prefix: '~' },
	});

	client.connect();
	client.on('connected', () => Log.info(`Twitch bot connected as ${username}`, true));
	client.on('message', (channel, tags, message) =>
	{
		const context = new ChatContext(client, channel, tags, message);
		const command = comtroller.run(message, { context });
		if(command)
			Log.command(context);
	});
}
