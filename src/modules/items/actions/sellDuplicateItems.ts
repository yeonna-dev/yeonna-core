import { ContextUtil } from '../../../common/ContextUtil';
import { UserNotFound } from '../../../common/errors';
import { findUser } from '../../users/actions';
import { ObtainableService } from '../../users/services/ObtainableService';
import { InventoriesService } from '../services/InventoriesService';
import { getUserItems } from './getUserItems';

export async function sellDuplicateItems({
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

  /* Get the items with duplicates and calculate the total price of all excess duplicate items. */
  let duplicatesSellPrice = 0;
  const itemsToUpdate: { code: string, amount: number; }[] = [];
  for(const { code, amount, price } of userItems)
  {
    if(amount <= 1)
      continue;

    duplicatesSellPrice += (amount - 1) * (price || 0);
    itemsToUpdate.push({
      code,
      amount: 1,
    });
  }

  /* Add the total price of all excess duplicate items to the user's points. */
  if(duplicatesSellPrice > 0)
    await ObtainableService.update({
      userId,
      addAmount: duplicatesSellPrice,
      context,
    });

  /* Update the duplicate item amounts to 1. */
  const updatedItems = await InventoriesService.updateUserItemAmounts({
    userId,
    items: itemsToUpdate,
    context,
  });

  return {
    sellPrice: duplicatesSellPrice,
    soldItems: updatedItems,
  };
}

