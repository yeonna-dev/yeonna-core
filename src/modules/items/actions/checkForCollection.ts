import { CollectionsService } from '../services/CollectionsService';
import { InventoriesService } from '../services/InventoriesService';

export async function checkForCollections(userId: string, context?: string)
{
  /* Get the items of the user. */
  const inventory = await InventoriesService.getUserItems(userId, context);
  if(!inventory || inventory.length === 0)
    return;

  /* Get the item codes of the items of the user. */
  const itemCodes = inventory.map(({ code }) => code);

  /* Save and get all new completed collections. */
  return CollectionsService.saveCompleted({
    userId,
    itemCodes,
    context,
  });
}
