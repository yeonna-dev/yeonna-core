import { Message } from 'discord.js';
import { Command } from 'comtroller';

import { getUserCollectibles } from '../../../../core/src';

export const collectibles: Command =
{
  name: 'collectibles',
  aliases: [ 'cs' ],
  run: async ({ message }: { message: Message }) =>
  {
    const collectibles = await getUserCollectibles({ discordID: message.author.id });
    message.channel.send(`${message.member?.displayName} has ${collectibles} collectibles.`);
  },
};
