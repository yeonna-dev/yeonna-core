import { CollectionsService } from '../services/CollectionsService';
import { InventoriesService } from '../services/InventoriesService';

import { findUser } from '../../users/actions';

import { ContextUtil } from '../../../common/ContextUtil';
import { UserNotFound } from '../../../common/errors';

export async function checkForCollection({
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

  /* Get the items of the user. */
  const inventory = await InventoriesService.getUserItems(userId, context);

  if(!inventory || inventory.length === 0)
    return;

  /* Get the item codes of the items of the user. */
  const itemCodes = inventory.map(({ code }) => code);

  /* Save and get all new completed collections. */
  return CollectionsService.saveCompleted({
    userId,
    itemCodes,
    context,
  });
}
