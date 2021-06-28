import { ObtainableService } from '../services/ObtainableService';
import { findUserByID } from './findUserByID';

export async function updateObtainables({
  userUUID,
  discordID,
  twitchID,
  amount,
  isCollectible,
  add,
  subtract,
  discordGuildID,
  twitchChannelID,
} : {
  userUUID?: string,
  discordID?: string,
  twitchID?: string,
  amount: number,
  isCollectible?: boolean,
  add?: boolean,
  subtract?: boolean,
  discordGuildID?: string,
  twitchChannelID?: string,
})
{
  if(! discordGuildID && ! twitchChannelID)
    throw new Error('No Discord Guild ID or Twitch Channel ID provided');

  amount = Math.abs(amount);

  userUUID = await findUserByID({ userUUID, discordID, twitchID, createIfNotExisting: true });
  if(! userUUID)
    throw new Error('Cannot update user points');

  /* Check if the user's obtainable record is already created. */
  const obtainables = await ObtainableService.getObtainable({
    userUUID,
    isCollectible,
    discordGuildID,
    twitchChannelID,
  });

  /* Create the obtainable record if not existing. */
  if(obtainables === undefined)
    await ObtainableService.createObtainable({
      userUUID,
      amount,
      isCollectible,
      discordGuildID,
      twitchChannelID,
    });
  else
  {
    let newPoints = amount;
    if(add)
      newPoints = obtainables + amount;
    if(subtract)
      newPoints = obtainables - amount;

    await ObtainableService.updateObtainables({
      userUUID,
      amount: newPoints,
      isCollectible,
      discordGuildID,
      twitchChannelID,
    });
  }
}

export async function updateUserPoints({
  userUUID,
  discordID,
  twitchID,
  amount,
  add,
  subtract,
  discordGuildID,
  twitchChannelID,
} : {
  userUUID?: string,
  discordID?: string,
  twitchID?: string,
  amount: number,
  add?: boolean,
  subtract?: boolean,
  discordGuildID?: string,
  twitchChannelID?: string,
}): Promise<void>
{
  await updateObtainables({
    userUUID,
    discordID,
    twitchID,
    amount,
    add,
    subtract,
    discordGuildID,
    twitchChannelID,
  });
}

export async function updateUserCollectibles({
  userUUID,
  discordID,
  twitchID,
  amount,
  add,
  subtract,
  discordGuildID,
  twitchChannelID,
} : {
  userUUID?: string,
  discordID?: string,
  twitchID?: string,
  amount: number,
  add?: boolean,
  subtract?: boolean,
  discordGuildID?: string,
  twitchChannelID?: string,
}): Promise<void>
{
  await updateObtainables({
    userUUID,
    discordID,
    twitchID,
    amount,
    isCollectible: true,
    add,
    subtract,
    discordGuildID,
    twitchChannelID,
  });
}
