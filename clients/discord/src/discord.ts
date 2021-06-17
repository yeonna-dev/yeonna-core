require('dotenv').config();

import { Client } from 'discord.js';
import { Comtroller } from 'comtroller';
import { commands } from './commands';

const comtroller = new Comtroller({
  commands,
  defaults: { prefix: '-' },
});

const discordBot = new Client();
discordBot.login(process.env.BOT_TOKEN);

// TODO: Change log message.
discordBot.on('ready', () => console.log(`Discord bot connected as ${discordBot.user?.tag}`));

discordBot.on('message', message =>
{
  if(message.author.bot)
    return;

  comtroller.run(message.content, { message });
});
