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
  userId,
  context,
  sellMode,
  category,
}: {
  userId: string,
  context?: string,
  sellMode: SellMode,
  category?: string,
})
{
  /* Get the user items. */
  const userItems = await getUserItems(userId, context);

  const itemsToUpdate: { code: string, amount: number; }[] = [];
  let sellPrice = 0;
  if([SellMode.All, SellMode.Duplicates, SellMode.Category].includes(sellMode))
  {
    /* Get the total price of the items to be sold and form
      the update data, which will update all the item amounts. */
    for(let { code, amount, category: itemCategory, price } of userItems)
    {
      let newAmount;
      if(
        sellMode === SellMode.All ||
        (sellMode === SellMode.Category && category === itemCategory)
      )
        newAmount = 0;

      if(sellMode === SellMode.Duplicates && amount > 1)
        newAmount = 1;

      if(newAmount === undefined)
        continue;

      sellPrice += (amount - newAmount) * (price || 0);
      itemsToUpdate.push({ code, amount: newAmount });
    }
  }

  /* Update the item amounts. */
  let soldItems: InventoryItem[] = [];
  if(itemsToUpdate.length > 0)
    soldItems = await InventoriesService.updateUserItemAmounts({
      userId,
      items: itemsToUpdate,
      context,
    });

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

export async function sellDuplicateItems(userId: string, context?: string)
{
  return sell({
    userId,
    context,
    sellMode: SellMode.Duplicates,
  });
}

export async function sellAllItems(userId: string, context?: string)
{
  return sell({
    userId,
    context,
    sellMode: SellMode.All,
  });
}

export async function sellByCategory({
  userId,
  context,
  category,
}: {
  userId: string,
  context?: string,
  category: string,
})
{
  return sell({
    userId,
    context,
    category,
    sellMode: SellMode.Category,
  });
}
