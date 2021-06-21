import { Message } from 'discord.js';
import { Command, parseParamsToArray } from 'comtroller';

import { getUserPoints } from '../../../../core/src';
import { getIdFromMention } from '../helpers/getIdFromMention';

export const points: Command =
{
  name: 'points',
  aliases: [ 'p' ],
  run: async ({ message, params }: { message: Message, params: string }) =>
  {
    let [ discordID ] = parseParamsToArray(params);
    discordID = discordID || message.author.id;
    discordID = getIdFromMention(discordID);

    message.channel.startTyping();

    try
    {
      const points = await getUserPoints({ discordID });
      // TODO: Update message
      message.channel.send(points?.toString() || 0);
    }
    catch(error)
    {
      message.channel.send(0);
    }
    finally
    {
      message.channel.stopTyping(true);
    }
  },
};
