import { findUser } from '../../users/actions';

import { ContextUtil } from '../../../common/ContextUtil';
import { UserNotFound } from '../../../common/errors';
import { CollectionsService } from '../services/CollectionsService';

export async function getUserCollections({
  userIdentifier,
  discordGuildId,
  twitchChannelId,
}: {
  userIdentifier: string,
  discordGuildId?: string,
  twitchChannelId?: string,
})
{
  /* Get the user with the given identifier. */
  const userId = await findUser(userIdentifier);
  if(!userId)
    throw new UserNotFound();

  const context = ContextUtil.createContext({ discordGuildId, twitchChannelId });

  return CollectionsService.getCollections({ userId, context });
}