import { ContextUtil } from '../../../common/ContextUtil';
import { UserNotFound } from '../../../common/errors';
import { findOrCreateUser } from '../../users/actions';
import { StreakService } from '../services/StreakService';

export async function update({
  count,
  increment,
  userIdentifier,
  discordGuildId,
  twitchChannelId,
}: {
  count?: number,
  increment?: boolean,
  userIdentifier: string,
  discordGuildId?: string,
  twitchChannelId?: string,
})
{
  if(!count && !increment)
    return;

  if(!discordGuildId && !twitchChannelId)
    throw new Error('No Discord Guild ID or Twitch Channel ID provided');

  /* Get the user with the given identifier. */
  const userId = await findOrCreateUser({ userIdentifier, discordGuildId });
  if(!userId)
    throw new UserNotFound();

  const context = ContextUtil.createContext({ discordGuildId, twitchChannelId });
  const existingStreak = await StreakService.get({ userId, context });
  let newStreak;
  if(!existingStreak)
    newStreak = await StreakService.create({ userId, context, count: 1 });
  if(count)
    newStreak = await StreakService.update({ userId, context, count });
  if(increment)
    newStreak = await StreakService.increment({ userId, context });

  if(!newStreak)
    return;

  return {
    previous: existingStreak,
    current: newStreak,
  };
}
