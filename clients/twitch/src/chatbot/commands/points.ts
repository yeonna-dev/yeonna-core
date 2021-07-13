import { Command } from 'comtroller';
import { getUserPoints } from 'yeonna-core';

import { ChatContext } from '../../utilities/ChatContext';

import { Log } from '../../utilities/logger';

// TODO: Update message
export const points: Command =
{
  name: 'points',
  aliases: [ 'p' ],
  run: async ({ context }: { context: ChatContext }) =>
  {
    const userIdentifier = context.tags['user-id'];
    if(! userIdentifier)
      return;

    try
    {
      const points = await getUserPoints({
        userIdentifier,
        twitchChannelID: context.tags['room-id'],
      });
      context.send(points?.toString() || '0');
    }
    catch(error)
    {
      Log.error(error);
      context.send('0');
    }
  },
};
