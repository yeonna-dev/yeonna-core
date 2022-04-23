import { ContextUtil } from '../../../common/ContextUtil';
import { UserNotFound } from '../../../common/errors';
import { findUser } from '../../users/actions';
import { InventoriesService } from '../services/InventoriesService';

export async function removeUserItems({
  userIdentifier,
  itemsToRemove = [],
  discordGuildId,
  twitchChannelId,
}: {
  userIdentifier: string,
  itemsToRemove:
  {
    code: string,
    amount: number,
  }[],
  discordGuildId?: string,
  twitchChannelId?: string,
})
{
  /* Get the user with the given identifier. */
  const userId = await findUser(userIdentifier);
  if(!userId)
    throw new UserNotFound();

  /* Update the user's inventory to remove the given items. */
  const context = ContextUtil.createContext({ discordGuildId, twitchChannelId });
  return InventoriesService.removeUserItem({
    userId,
    items: itemsToRemove.map(({ code, amount }) => ({ code, amount })),
    context,
  });
}
