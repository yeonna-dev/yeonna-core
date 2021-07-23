import { Command } from 'comtroller';
import { updateUserPoints } from 'yeonna-core';

import { getMentionedUserAndAmount } from '../actions/getMentionAndAmount';

import { ChatContext } from '../../utilities/ChatContext';
import { Log } from '../../utilities/logger';

export const addpoints: Command =
{
  name: 'addpoints',
  run: async ({ context, params }: { context: ChatContext, params: string }) =>
  {
    const args = await getMentionedUserAndAmount(context, params);
    if(! args)
      return;

    const { user, amount, channel } = args;
    try
    {
      await updateUserPoints({
        twitchID: user.id,
        twitchChannelID: channel,
        amount,
        add: true,
      });

      context.send(`Added ${amount} points to @${user.displayName}`, true);
    }
    catch(error)
    {
      Log.error(error);
      context.send('Cannot add points');
    }
  },
};
