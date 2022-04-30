import { ContextUtil } from '../../../common/ContextUtil';
import { UserNotFound } from '../../../common/errors';
import { findOrCreateUser } from '../../users/actions';
import { StreakService } from '../services/StreakService';

export async function get({
  userIdentifier,
  discordGuildId,
  twitchChannelId,
}: {
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

  return StreakService.get({ userId, context });
}
