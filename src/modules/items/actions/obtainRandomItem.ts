import { InventoriesService } from '../services/InventoriesService';
import { ItemsService } from '../services/ItemsService';

export const obtainRandomItem = async (userId: string, context?: string) =>
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
};