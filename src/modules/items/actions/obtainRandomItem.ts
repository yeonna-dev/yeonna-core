import { withUserAndContext } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { InventoryService } from '../services/InventoryService';
import { ItemService } from '../services/ItemService';

export const obtainRandomItem = (identifiers: Identifiers) =>
  withUserAndContext(identifiers)(
    async (userId, context) =>
    {
      /* Get a random item. */
      const chance = Math.random() * 100;
      const randomItem = await ItemService.findRandom(chance, context);
      if(!randomItem)
        return;

      /* Add item to the user. */
      await InventoryService.addUserItems({
        userId,
        items: [{ code: randomItem.code, amount: 1 }],
        context,
      });

      return randomItem;
    },
    { createNonexistentUser: true },
  );
