import { ObtainableService } from '../services/ObtainableService';
import { UsersService } from '../services/UsersService';

import { ContextUtil } from '../../../common/ContextUtil';

type TopObtainables = {
  userId: string;
  discordId?: string | null;
  twitchId?: string | null;
  amount: number;
};

// TODO: Join getting users with obtainables
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
  const topObtainables = await ObtainableService.getTop({
    count,
    isCollectible,
    context,
  });

  if(!topObtainables)
    return [];

  /* Get users of top points. */
  const userIds = topObtainables.map(({ userId }) => userId);
  const users = await UsersService.find({ ids: userIds });
  if(!users || !Array.isArray(users))
    return [];

  /* Get the user of each top record. */
  const topObtainablesWithUser: TopObtainables[] = [];
  for(const { userId, amount } of topObtainables)
  {
    /* Find the user of the points. */
    let pointsUser;
    for(const user of users)
    {
      if(user.id === userId)
      {
        pointsUser = user;
        break;
      }
    }

    if(!pointsUser)
      continue;

    topObtainablesWithUser.push({
      userId: pointsUser.id,
      discordId: pointsUser.discordId,
      twitchId: pointsUser.twitchId,
      amount,
    });
  }

  return topObtainablesWithUser;
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
