import { ObtainableService } from '../services/ObtainableService';
import { findOrCreateUser } from './findUser';

export async function updateObtainables({
  userID,
  discordID,
  twitchID,
  amount,
  isCollectible,
  add,
  subtract,
  discordGuildID,
  twitchChannelID,
} : {
  userID?: string,
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

  userID = await findOrCreateUser({ userID, discordID, twitchID });
  if(! userID)
    throw new Error('Cannot update user points');

  /* Check if the user's obtainable record is already created. */
  const obtainables = await ObtainableService.getObtainable({
    userID,
    isCollectible,
    discordGuildID,
    twitchChannelID,
  });

  /* Create the obtainable record if not existing. */
  if(obtainables === undefined)
    await ObtainableService.createObtainable({
      userID,
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
      userID,
      amount: newPoints,
      isCollectible,
      discordGuildID,
      twitchChannelID,
    });
  }
}

export async function updateUserPoints({
  userID,
  discordID,
  twitchID,
  amount,
  add,
  subtract,
  discordGuildID,
  twitchChannelID,
} : {
  userID?: string,
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
    userID,
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
  userID,
  discordID,
  twitchID,
  amount,
  add,
  subtract,
  discordGuildID,
  twitchChannelID,
} : {
  userID?: string,
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
    userID,
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
