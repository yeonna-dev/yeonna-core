import { ContextUtil } from '../../../common/ContextUtil';
import { UserNotFound } from '../../../common/errors';
import { findOrCreateUser } from '../../users/actions';
import { StreakService } from '../services/StreakService';

export async function update({
  count,
  increment,
  decrement,
  userIdentifier,
  discordGuildId,
  twitchChannelId,
}: {
  count?: number,
  increment?: boolean,
  decrement?: boolean,
  userIdentifier: string,
  discordGuildId?: string,
  twitchChannelId?: string,
})
{
  if(!discordGuildId && !twitchChannelId)
    throw new Error('No Discord Guild ID or Twitch Channel ID provided');

  /* Get the user with the given identifier. */
  const userId = await findOrCreateUser({ userIdentifier, discordGuildId });
  if(!userId)
    throw new UserNotFound();

  const context = ContextUtil.createContext({ discordGuildId, twitchChannelId });
  const existingStreak = await StreakService.get({ userId, context });

  const currentStreakCount = existingStreak?.count || 0;
  if(!count)
  {
    if(increment)
      count = currentStreakCount + 1;
    else if(decrement)
      count = currentStreakCount - 1;
    else
      count = 0;
  }

  if(count < 0)
    count = 0;

  let longest;
  if(count > (existingStreak?.longest || 0))
    longest = count;

  const newStreak = existingStreak
    ? await StreakService.update({ userId, context, count, longest })
    : await StreakService.create({ userId, context, count });

  if(!newStreak)
    return;

  return {
    previous: existingStreak,
    current: newStreak,
  };
}
