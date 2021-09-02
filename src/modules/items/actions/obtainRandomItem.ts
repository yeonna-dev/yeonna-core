import { ItemsService } from '../services/ItemsService';
import { InventoriesService } from '../services/InventoriesService';

import { findUser } from '../../users/actions';

import { UserNotFound } from '../../../common/errors';
import { ContextUtil } from '../../../common/ContextUtil';

export async function obtainRandomItem({
  userIdentifier,
  discordGuildID,
  twitchChannelID,
} : {
  userIdentifier: string,
  discordGuildID?: string,
  twitchChannelID?: string,
}): Promise<Item | undefined>
{
  /* Get a random item. */
  const chance = Math.random() * 100;
  const items = await ItemsService.find({ chance });
  const randomItem = items[Math.floor(Math.random() * items.length)];
  if(! randomItem)
    return;

  /* Get the user with the given identifier. */
  const userID = await findUser(userIdentifier);
  if(! userID)
    throw new UserNotFound();

  /* Add item to the user. */
  const context = ContextUtil.createContext({ discordGuildID, twitchChannelID });
  await InventoriesService.updateOrCreateUserItem({
    itemCode: randomItem.code,
    userID,
    context,
    add: true,
  });

  return randomItem;
}
