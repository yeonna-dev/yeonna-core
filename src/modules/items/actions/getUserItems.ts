import { InventoriesService } from '../services/InventoriesService';

import { findUser } from '../../users/actions';

import { ContextUtil } from '../../../common/ContextUtil';
import { UserNotFound } from '../../../common/errors';

export async function getUserItems({
  userIdentifier,
  discordGuildID,
  twitchChannelID,
}: {
  userIdentifier: string,
  discordGuildID?: string,
  twitchChannelID?: string,
})
{
  /* Get the user with the given identifier. */
  const userID = await findUser(userIdentifier);
  if(!userID)
    throw new UserNotFound();

  const context = ContextUtil.createContext({ discordGuildID, twitchChannelID });
  const inventory = await InventoriesService.getUserItems(userID, context);
  return inventory;
}
