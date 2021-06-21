import { updateObtainables } from './updateObtainables';

export async function updateUserPoints({
  userUUID,
  discordID,
  amount,
  add,
  subtract,
  discordGuildID,
}: {
  userUUID?: string,
  discordID?: string,
  amount: number,
  add?: boolean,
  subtract?: boolean,
  discordGuildID?: string
}): Promise<void>
{
  await updateObtainables({ userUUID, discordID, amount, add, subtract, discordGuildID });
}
