import { transferObtainables } from './transferObtainables';

export async function transferUserCollectibles({
  fromUserUUID,
  fromDiscordUserID,
  toUserUUID,
  toDiscordUserID,
  amount,
  discordGuildID,
} : {
  fromUserUUID?: string,
  fromDiscordUserID?: string,
  toUserUUID?: string,
  toDiscordUserID?: string,
  amount: number,
  discordGuildID?: string,
}): Promise<void>
{
  await transferObtainables({
    fromUserUUID,
    fromDiscordUserID,
    toUserUUID,
    toDiscordUserID,
    amount,
    discordGuildID,
    isCollectible: true,
  });
}
