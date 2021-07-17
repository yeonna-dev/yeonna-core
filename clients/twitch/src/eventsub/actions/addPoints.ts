import { RewardRedemptionAddEvent } from 'tesjs';
import { updateUserPoints } from 'yeonna-core';

import { client } from '../../chatbot/initChatBot';
import { Log } from '../../utilities/logger';

export async function addPoints(event: RewardRedemptionAddEvent)
{
  try
  {
    const add = await updateUserPoints({
      twitchID: event.user_id,
      amount: event.reward.cost,
      add: true,
      twitchChannelID: event.broadcaster_user_id,
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
