import { ContextUtil } from '../../../common/ContextUtil';
import { UserNotFound } from '../../../common/errors';
import { findUser } from '../../users/actions';
import { ObtainableService } from '../../users/services/ObtainableService';
import { InventoriesService, InventoryItem } from '../services/InventoriesService';
import { getUserItems } from './getUserItems';

enum SellMode
{
  All,
  Duplicates,
  Single,
  Category,
}

async function sell({
  userIdentifier,
  sellMode,
  category,
  discordGuildId,
  twitchChannelId,
}: {
  userIdentifier: string,
  sellMode: SellMode,
  category?: string,
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

  const itemsToUpdate: { code: string, amount: number; }[] = [];
  if([SellMode.All, SellMode.Duplicates, SellMode.Category].includes(sellMode))
  {
    /* Get the total price of the items to be sold and form
      the update data, which will update all the item amounts. */
    for(let { code, amount, category: itemCategory } of userItems)
    {
      let newAmount;
      if(
        sellMode === SellMode.All ||
        (sellMode === SellMode.Category && category === itemCategory)
      )
        newAmount = 0;
      if(sellMode === SellMode.Duplicates && amount > 1)
        newAmount = 1;

      if(newAmount !== undefined)
        itemsToUpdate.push({ code, amount: newAmount });
    }
  }

  /* Update the item amounts. */
  let sellPrice = 0;
  let soldItems: InventoryItem[] = [];
  if(itemsToUpdate.length > 0)
  {
    soldItems = await InventoriesService.updateUserItemAmounts({
      userId,
      items: itemsToUpdate,
      context,
    });

    sellPrice = soldItems.reduce((total, item) => total + (item.price || 0), 0);
  }

  /* Add the total price of the items to the user's points. */
  if(sellPrice > 0)
    await ObtainableService.update({
      userId,
      addAmount: sellPrice,
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
    sellMode: SellMode.All,
    discordGuildId,
    twitchChannelId,
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
    sellMode: SellMode.Duplicates,
    discordGuildId,
    twitchChannelId,
  });
}

export async function sellByCategory({
  userIdentifier,
  category,
  discordGuildId,
  twitchChannelId,
}: {
  userIdentifier: string,
  category: string,
  discordGuildId?: string,
  twitchChannelId?: string,
})
{
  return sell({
    userIdentifier,
    sellMode: SellMode.Category,
    category,
    discordGuildId,
    twitchChannelId,
  });
}
