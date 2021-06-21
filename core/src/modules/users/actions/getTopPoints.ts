import { getTopObtainables } from  './getTopObtainables';

export function getTopPoints(count: number, discordGuildID?: string)
{
  return getTopObtainables({ count, discordGuildID });
}
