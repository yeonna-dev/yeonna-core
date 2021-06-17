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
    let [ discordUser ] = parseParamsToArray(params);
    discordUser = discordUser || message.author.id;
    discordUser = getIdFromMention(discordUser);

    message.channel.startTyping();

    try
    {
      const points = await getUserPoints(discordUser);
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
