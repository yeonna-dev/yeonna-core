import { ContextUtil } from '../../../common/ContextUtil';
import { UserNotFound } from '../../../common/errors';
import { findUser } from '../../users/actions';
import { ObtainableService } from '../../users/services/ObtainableService';
import { InventoriesService } from '../services/InventoriesService';
import { getUserItems } from './getUserItems';

export async function sellAllItems({
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

  /* Get the user items. */
  const userItems = await getUserItems({
    userIdentifier,
    discordGuildId,
    twitchChannelId,
  });

  /* Get the total price of all items and form the update data,
    which will set all item amounts to 0. */
  let totalSellPrice = 0;
  const itemsToUpdate: { code: string, amount: number; }[] = [];
  for(const { code, price, amount } of userItems)
  {
    totalSellPrice += amount * (price || 0);
    itemsToUpdate.push({ code, amount: 0 });
  }

  /* Add the total price of all items to the user's points. */
  if(totalSellPrice > 0)
    await ObtainableService.update({
      userId,
      addAmount: totalSellPrice,
      context,
    });

  /* Update all the item amounts to 0. */
  await InventoriesService.updateUserItemAmounts({
    userId,
    items: itemsToUpdate,
    context,
  });

  return totalSellPrice;
}
