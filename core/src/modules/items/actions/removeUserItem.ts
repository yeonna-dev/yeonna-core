import { ItemsService } from '../services/ItemsService';
import { InventoriesService } from '../services/InventoriesService';

import { findUser } from '../../users/actions';

import { ContextUtil } from '../../../common/ContextUtil';
import { ItemNotFound, UserNotFound } from '../../../common/errors';

export async function removeUserItem({
  userIdentifier,
  itemCode,
  discordGuildID,
  twitchChannelID,
} : {
  userIdentifier: string,
  itemCode: string,
  discordGuildID?: string,
  twitchChannelID?: string,
})
{
  /* Get the item with the given code. */
  const [ item ] = await ItemsService.find({ code: itemCode });
  if(! item)
    throw new ItemNotFound();

  /* Get the user with the given identifier. */
  const userID = await findUser(userIdentifier);
  if(! userID)
    throw new UserNotFound();

  /* Update the user's inventory to remove the given item. */
  const context = ContextUtil.createContext({ discordGuildID, twitchChannelID });
  await InventoriesService.updateUserItem({
    userID,
    itemCode,
    context,
    remove: true,
  });
}
