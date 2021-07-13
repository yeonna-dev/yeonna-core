import { Command } from 'comtroller';
import { RewardRedemptionAddEvent } from 'tesjs';
import { updateUserPoints } from 'yeonna-core';

import { client } from '../../../chatbot/initChatBot';
import { Log } from '../../../utilities/logger';

export const AddHotdogCoin: Command =
{
  name: 'AddHotdogCoin',
  run: async ({ event } : { event: RewardRedemptionAddEvent }) =>
  {
    const amount = event.reward.cost;
    try
    {
      const add = await updateUserPoints({
        twitchID: event.user_id,
        amount,
        add: true,
        twitchChannelID: event.broadcaster_user_id
      });

      client.say(
        `#${event.broadcaster_user_login}`,
        `@${event.user_name}, redeemed ${event.reward.title}, now has ${add} 💲🌭`,
      );
    }
    catch(error)
    {
      Log.error(error);
    }
  }
};
