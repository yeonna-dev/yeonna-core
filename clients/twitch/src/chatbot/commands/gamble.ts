import { Command, parseParamsToArray } from 'comtroller';
import
{
  getUserPoints,
  updateUserPoints,
} from 'yeonna-core';

import { ChatContext } from '../../utilities/ChatContext';
import { Log } from '../../utilities/logger';

export const gamble: Command =
{
  name: 'gamble',
  aliases: ['flip', 'f', 'coinflip'],
  run: async ({ context, params }: { context: ChatContext, params: string }) =>
  {
    const twitchChannelID = context.tags['room-id'];
    const userIdentifier = context.tags['user-id'];

    if(! userIdentifier)
      return;

    const [ betString ] = parseParamsToArray(params);

    let points;
    try
    {
      points = await getUserPoints({
        twitchChannelID,
        userIdentifier,
      });

      if(! points)
        return context.send('please buy 🌭 via channel points');
    }
    catch(error)
    {
      Log.error(error);
    }

    if(! points)
      return;

    const bet = betString.toLowerCase() == 'all' ? points : parseInt(betString);
    if(isNaN(bet))
      return context.send('please enter bet amount(!bet [amount])');

    if(points < bet)
      return context.send('you don\'t have enough 💲🌭');

    const updateArguments: any =
    {
      twitchID: userIdentifier,
      amount: bet,
      twitchChannelID,
    };

    const odds = Math.random() * 100;
    const won = odds >= 50;
    if(won)
      updateArguments.add = true;
    else
      updateArguments.subtract = true;

    try
    {
      const updatedPoints = await updateUserPoints(updateArguments);
      context.send(`You ${won ? 'won' : 'lost'} ${bet}, you have ${updatedPoints} 💲🌭`);
    }
    catch(error)
    {
      Log.error(error);
    }
  }
};
