import { Command, parseParamsToArray } from 'comtroller';
import { NotEnoughPoints, transferUserPoints } from 'yeonna-core';

import { API } from '../../api';

import { ChatContext } from '../../utilities/ChatContext';
import { Log } from '../../utilities/logger';

export const give: Command =
{
  name: 'give',
  aliases: [ 'pay' ],
  run: async ({ context, params }: { context: ChatContext, params: string }) =>
  {
    const userID = context.tags['user-id'];
    const twitchChannelID = context.tags['room-id'];
    if(! userID || ! twitchChannelID)
      return;

    const [ mentioned, amountString ] = parseParamsToArray(params);
    if(! mentioned && ! amountString)
      return;

    let amount = parseInt(amountString);
    if(isNaN(amount))
      return context.send('please enter the amount');

    const user = await API.getUserByName(mentioned.replace(/@/g, ''));
    if(! user)
      return;

    try
    {
      await transferUserPoints({
        fromUserIdentifier: userID,
        toTwitchUserID: user.id,
        amount,
        twitchChannelID,
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
