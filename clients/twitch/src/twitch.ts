require('dotenv').config();

import { Client } from 'tmi.js';
import { Comtroller } from 'comtroller';

import { loadCommands } from './commands';

import { ChatContext } from './utilities/ChatContext';
import { Log } from './utilities/logger';

(async () =>
{
	const commands = await loadCommands();
	const comtroller = new Comtroller({
		commands,
		defaults: { prefix: '~' },
	});

	const username = process.env.TWITCH_USERNAME;
	const client = new Client({
		connection: { secure: true, reconnect: true },
		identity: { username, password: process.env.TWITCH_PASSWORD },
		channels: [ 'esfox316' ],
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
})();
