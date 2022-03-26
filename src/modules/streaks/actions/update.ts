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
  return count
    ? StreakService.updateOrCreate({ userId, count, context })
    : StreakService.increment({ userId, context });
}
