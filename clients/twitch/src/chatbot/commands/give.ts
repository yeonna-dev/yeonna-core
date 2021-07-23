import { Command } from 'comtroller';
import { NotEnoughPoints, transferUserPoints } from 'yeonna-core';

import { ChatContext } from '../../utilities/ChatContext';
import { Log } from '../../utilities/logger';
import { getMentionedUserAndAmount } from '../actions/getMentionAndAmount';

export const give: Command =
{
  name: 'give',
  aliases: [ 'pay' ],
  run: async ({ context, params }: { context: ChatContext, params: string }) =>
  {
    const args = await getMentionedUserAndAmount(context, params);
    if(! args)
      return;

    const { user, amount, channel } = args;
    const userID = context.tags['user-id'];
    if(! userID || ! channel)
      return;

    try
    {
      await transferUserPoints({
        fromUserIdentifier: userID,
        toTwitchUserID: user.id,
        twitchChannelID: channel,
        amount,
      });

      context.send(`gave ${amount} points to @${user.displayName}`);
    }
    catch(error)
    {
      Log.error(error);

      if(error instanceof NotEnoughPoints)
        return context.send('not enough points');

      context.send('Cannot add points');
    }
  },
};
