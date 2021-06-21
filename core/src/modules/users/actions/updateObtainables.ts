import { ObtainableService } from '../services/ObtainableService';
import { findUserByID } from './findUserByID';

export async function updateObtainables({
  userUUID,
  discordID,
  amount,
  isCollectible,
  add,
  subtract,
  discordGuildID,
} : {
  userUUID?: string,
  discordID?: string,
  amount: number,
  isCollectible?: boolean,
  add?: boolean,
  subtract?: boolean,
  discordGuildID?: string,
})
{
  amount = Math.abs(amount);

  userUUID = await findUserByID({ userUUID, discordID, createIfNotExisting: true });
  if(! userUUID)
    throw new Error('Cannot update user points');

  /* Check if the user's obtainable record is already created. */
  const obtainables = await ObtainableService.getObtainable(userUUID, isCollectible);

  /* Create the obtainable record if not existing. */
  if(obtainables === undefined)
    await ObtainableService.createObtainable({ userUUID, discordGuildID, amount, isCollectible })
  else
  {
    let newPoints = amount;
    if(add)
      newPoints = obtainables + amount;
    if(subtract)
      newPoints = obtainables - amount;

    await ObtainableService.updateObtainables(userUUID, newPoints, isCollectible);
  }
}
