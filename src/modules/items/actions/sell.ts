import { ContextUtil } from '../../../common/ContextUtil';
import { UserNotFound } from '../../../common/errors';
import { findUser } from '../../users/actions';
import { ObtainableService } from '../../users/services/ObtainableService';
import { InventoriesService } from '../services/InventoriesService';
import { getUserItems } from './getUserItems';

enum SellMode
{
  All,
  Duplicates,
  Single,
}

async function sell({
  userIdentifier,
  discordGuildId,
  twitchChannelId,
  sellMode,
}: {
  userIdentifier: string,
  discordGuildId?: string,
  twitchChannelId?: string,
  sellMode: SellMode,
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

  /* Get the total price of the items to be sold and form
    the update data, which will update all the item amounts. */
  let sellPrice = 0;
  const itemsToUpdate: { code: string, amount: number; }[] = [];
  for(let { code, price, amount } of userItems)
  {
    price = price || 0;
    if(sellMode === SellMode.All)
    {
      sellPrice += amount * price;
      itemsToUpdate.push({ code, amount: 0 });
    }
    if(sellMode === SellMode.Duplicates)
    {
      sellPrice += (amount - 1) * price;
      itemsToUpdate.push({ code, amount: 1 });
    }
  }

  /* Add the total price of the items to the user's points. */
  if(sellPrice > 0)
    await ObtainableService.update({
      userId,
      addAmount: sellPrice,
      context,
    });

  /* Update the item amounts. */
  const soldItems = await InventoriesService.updateUserItemAmounts({
    userId,
    items: itemsToUpdate,
    context,
  });

  return {
    sellPrice,
    soldItems,
  };
}

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
  return sell({
    userIdentifier,
    discordGuildId,
    twitchChannelId,
    sellMode: SellMode.All,
  });
}

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
  return sell({
    userIdentifier,
    discordGuildId,
    twitchChannelId,
    sellMode: SellMode.Duplicates,
  });
}
