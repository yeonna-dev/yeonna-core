import { InventoriesService } from '../services/InventoriesService';
import { ItemsService } from '../services/ItemsService';

import { findUser } from '../../users/actions';

import { ContextUtil } from '../../../common/ContextUtil';
import { UserNotFound } from '../../../common/errors';

export async function getUserItems({
  userIdentifier,
  discordGuildID,
  twitchChannelID,
} : {
  userIdentifier: string,
  discordGuildID?: string,
  twitchChannelID?: string,
}): Promise<InventoryItem[]>
{
  /* Get the user with the given identifier. */
  const userID = await findUser(userIdentifier);
  if(! userID)
    throw new UserNotFound();

  const context = ContextUtil.createContext({ discordGuildID, twitchChannelID });
  const inventory = await InventoriesService.getUserItems(userID, context);

  /* Get the item codes of the inventory items and create an object map
    of each inventory item with the item code as the key. */
  const codes: string[] = [];
  const inventoryMap: { [key: string]: Inventory } = {};
  for(const item of inventory)
  {
    if(! codes.includes(item.itemCode))
      codes.push(item.itemCode);

    inventoryMap[item.itemCode] = item;
  }

  /* Get the item records of each inventory item and set the item record of each inventory item. */
  const items = await ItemsService.findByCodes(codes);
  const inventoryItems: InventoryItem[] = [];
  for(const item of items)
  {
    const inventoryMapItem = inventoryMap[item.code];
    if(! inventoryMapItem)
      continue;

    inventoryItems.push({
      ...item,
      amount: inventoryMapItem.amount,
      context: inventoryMapItem.context,
    });
  }

  return inventoryItems;
}
