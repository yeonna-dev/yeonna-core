import { Message } from 'discord.js';
import { Command, parseParamsToArray } from 'comtroller';

import { getUserPoints } from 'yeonna-core';
import { getIdFromMention } from '../helpers/getIdFromMention';

import { Log } from '../utilities/logger';

// TODO: Update message
export const points: Command =
{
  name: 'points',
  aliases: [ 'p' ],
  run: async ({ message, params }: { message: Message, params: string }) =>
  {
    if(! message.guild)
      return message.channel.send('This command can only be used in a guild.');

    let [ discordID ] = parseParamsToArray(params);
    discordID = discordID || message.author.id;
    discordID = getIdFromMention(discordID);

    message.channel.startTyping();

    try
    {
      const points = await getUserPoints({ discordID, discordGuildID: message.guild.id });
      message.channel.send(points?.toString() || 0);
    }
    catch(error)
    {
      Log.error(error);
      message.channel.send(0);
    }
    finally
    {
      message.channel.stopTyping(true);
    }
  },
};
