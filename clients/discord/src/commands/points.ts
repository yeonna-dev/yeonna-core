import { Message } from 'discord.js';
import { Command, parseParamsToArray } from 'comtroller';

import { getDiscordUserPoints } from '../../../../core/src';
import { getIdFromMention } from '../helpers/getIdFromMention';

export const points: Command =
{
  name: 'points',
  aliases: [ 'p' ],
  run: async ({ message, params }: { message: Message, params: string }) =>
  {
    let [ user ] = parseParamsToArray(params);
    user = user || message.author.id;
    user = getIdFromMention(user);

    try
    {
      const points = await getDiscordUserPoints(user);
      // TODO: Update message
      message.channel.send(points?.toString() || 0);
    }
    catch(error)
    {
      message.channel.send(0);
    }
  },
};
