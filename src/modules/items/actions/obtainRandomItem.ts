import { ItemsService } from '../services/ItemsService';
import { InventoriesService } from '../services/InventoriesService';

import { findUser } from '../../users/actions';

import { UserNotFound } from '../../../common/errors';
import { ContextUtil } from '../../../common/ContextUtil';

export async function obtainRandomItem({
  userIdentifier,
  discordGuildID,
  twitchChannelID,
}: {
  userIdentifier: string,
  discordGuildID?: string,
  twitchChannelID?: string,
}): Promise<Item | undefined>
{
  /* Get a random item. */
  const chance = Math.random() * 100;
  const randomItem = await ItemsService.findRandom({ chance });
  if(!randomItem)
    return;

  /* Get the user with the given identifier. */
  const userId = await findUser(userIdentifier);
  if(!userId)
    throw new UserNotFound();

  /* Add item to the user. */
  const context = ContextUtil.createContext({ discordGuildID, twitchChannelID });
  await InventoriesService.addUserItems({
    userId,
    items: [{ code: randomItem.code, amount: 1 }],
    context,
  });

  return randomItem;
}
