import { ObtainableService } from '../services/ObtainableService';

import { ContextUtil } from '../../../common/ContextUtil';

type TopObtainables = {
  userId: string;
  discordId?: string;
  twitchId?: string;
  amount: number;
};

export async function getTopObtainables({
  count,
  isCollectible,
  discordGuildId,
  twitchChannelId,
}: {
  count: number,
  isCollectible?: boolean,
  discordGuildId?: string,
  twitchChannelId?: string,
}): Promise<TopObtainables[]>
{
  const context = ContextUtil.createContext({ discordGuildId, twitchChannelId });

  /* Get top points. */
  const topObtainables = await ObtainableService.getTopWithUsers({
    count,
    isCollectible,
    context,
  });

  return topObtainables.map(({ user, amount }) => ({
    userId: user.id,
    discordId: user.discordId,
    twitchId: user.twitchId,
    amount,
  }));
}

export function getTopPoints({
  count,
  discordGuildId,
  twitchChannelId,
}: {
  count: number,
  discordGuildId?: string,
  twitchChannelId?: string,
})
{
  return getTopObtainables({ count, discordGuildId, twitchChannelId });
}

export function getTopCollectibles({
  count,
  discordGuildId,
  twitchChannelId,
}: {
  count: number,
  discordGuildId?: string,
  twitchChannelId?: string,
})
{
  return getTopObtainables({ count, isCollectible: true, discordGuildId, twitchChannelId });
}
