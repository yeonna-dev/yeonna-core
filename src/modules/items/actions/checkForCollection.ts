import { withUserAndContext } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { CollectionsService } from '../services/CollectionsService';
import { InventoriesService } from '../services/InventoriesService';

export const checkForCollections = (identifiers: Identifiers) =>
  withUserAndContext(identifiers)(
    async (userId, context) =>
    {
      /* Get the items of the user. */
      const inventory = await InventoriesService.getUserItems({ userId, context });
      if(!inventory || inventory.length === 0)
        return;

      /* Get the item codes of the items of the user. */
      const itemCodes = inventory.filter(({ amount }) => amount > 0).map(({ code }) => code);

      /* Save and get all new completed collections. */
      return CollectionsService.saveCompleted({
        userId,
        itemCodes,
        context,
      });
    }
  );

