import { InventoriesService } from '../services/InventoriesService';

import { findUser } from '../../users/actions';

import { ContextUtil } from '../../../common/ContextUtil';
import { UserNotFound } from '../../../common/errors';

export async function removeUserItems({
  userIdentifier,
  itemsToRemove = [],
  discordGuildID,
  twitchChannelID,
} : {
  userIdentifier: string,
  itemsToRemove:
  {
    code: string,
    amount: number,
  }[],
  discordGuildID?: string,
  twitchChannelID?: string,
})
{
  /* Get the user with the given identifier. */
  const userID = await findUser(userIdentifier);
  if(! userID)
    throw new UserNotFound();

  /* Update the user's inventory to remove the given items. */
  const context = ContextUtil.createContext({ discordGuildID, twitchChannelID });
  return InventoriesService.updateUserItems({
    userID,
    items: itemsToRemove.map(({ code, amount }) => ({ code, amount })),
    context,
  });
}
