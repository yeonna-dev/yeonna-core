import { getTopObtainables } from  './getTopObtainables';

export function getTopCollectibles(count: number, discordGuildID?: string)
{
  return getTopObtainables({ count, isCollectible: true, discordGuildID });
}
