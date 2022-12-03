import { withUserAndContext } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { ObtainableService } from '../../obtainables/services/ObtainableService';
import { InventoryItem, InventoryService } from '../services/InventoryService';
import { getUserItems } from './getUserItems';

enum SellMode
{
  All,
  Duplicates,
  Single,
  Category,
}

const sell = ({
  sellMode,
  category,
  ...identifiers
}: Identifiers & { sellMode: SellMode, category?: string, }) =>
  withUserAndContext(identifiers)(
    async (userId, context) =>
    {
      /* Get the user items. */
      const userItems = await getUserItems(identifiers);
      if(!userItems)
        return;

      category = category?.toLowerCase();

      const itemsToUpdate: { code: string, amount: number; }[] = [];
      const soldItems: InventoryItem[] = [];
      let sellPrice = 0;
      if([SellMode.All, SellMode.Duplicates, SellMode.Category].includes(sellMode))
      {
        /* Get the total price of the items to be sold and form
          the update data, which will update all the item amounts. */
        for(let { code, amount, category: itemCategory, price } of userItems)
        {
          itemCategory = itemCategory?.toLowerCase();

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
          soldItems.push({ code, amount });
          itemsToUpdate.push({ code, amount: newAmount });
        }
      }

      /* Update the item amounts. */
      if(itemsToUpdate.length > 0)
        await InventoryService.updateUserItemAmounts({
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
  );

export const sellDuplicateItems = (identifiers: Identifiers) =>
  sell({
    ...identifiers,
    sellMode: SellMode.Duplicates,
  });

export const sellAllItems = (identifiers: Identifiers) =>
  sell({
    ...identifiers,
    sellMode: SellMode.All,
  });

export const sellByCategory = ({
  category,
  ...identifiers
}: Identifiers & { category: string; }) =>
  sell({
    ...identifiers,
    category,
    sellMode: SellMode.Category,
  });
