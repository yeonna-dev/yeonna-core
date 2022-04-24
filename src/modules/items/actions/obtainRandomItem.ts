import { withUserAndContext } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { InventoriesService } from '../services/InventoriesService';
import { ItemsService } from '../services/ItemsService';

export const obtainRandomItem = (identifiers: Identifiers) =>
  withUserAndContext(identifiers)(
    async (userId, context) =>
    {
      /* Get a random item. */
      const chance = Math.random() * 100;
      const randomItem = await ItemsService.findRandom(chance, context);
      if(!randomItem)
        return;

      /* Add item to the user. */
      await InventoriesService.addUserItems({
        userId,
        items: [{ code: randomItem.code, amount: 1 }],
        context,
      });

      return randomItem;
    },
    { createNonexistentUser: true },
  );
