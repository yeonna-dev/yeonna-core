import { GuildMember, Message } from 'discord.js';
import { Command } from 'comtroller';

import { getTopPoints } from '../../../../core/src';

import { findDiscordUser } from '../actions/findDiscordUser';

// TODO: Update responses
export const pointstop: Command =
{
  name: 'pointstop',
  aliases: [ 'ptop' ],
  run: async ({ message }: { message: Message }) =>
  {
    if(! message.guild)
      return message.channel.send('This command can only be used in a guild.');

    message.channel.startTyping();

    const top = await getTopPoints(10, message.guild.id);
    let board = '';
    for(const i in top)
    {
      const { discordID, points } = top[i];
      if(! discordID)
        continue;

      const discordUser = await findDiscordUser(message, discordID);
      if(! discordUser)
        continue;

      const name = discordUser instanceof GuildMember
        ? discordUser.displayName
        : discordUser.username;

      board += `${parseInt(i) + 1}. ${points} - ${name}\n`;
    }

    message.channel.send(board);
    message.channel.stopTyping(true);
  },
};
