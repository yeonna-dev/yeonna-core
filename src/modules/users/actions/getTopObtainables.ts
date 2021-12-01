import { ObtainableService, ObtainableFields } from '../services/ObtainableService';
import { UsersService } from '../services/UsersService';

import { ContextUtil } from '../../../common/ContextUtil';

type TopObtainables = {
  userID: string;
  discordID?: string | null;
  twitchID?: string | null;
  amount: number;
};

// TODO: Join getting users with obtainables
export async function getTopObtainables({
  count,
  isCollectible,
  discordGuildID,
  twitchChannelID,
}: {
  count: number,
  isCollectible?: boolean,
  discordGuildID?: string,
  twitchChannelID?: string,
}): Promise<TopObtainables[]>
{
  const context = ContextUtil.createContext({ discordGuildID, twitchChannelID });

  /* Get top points. */
  const top = await ObtainableService.getTop({
    count,
    isCollectible,
    context,
  });

  if(!top)
    return [];

  /* Get users of top points. */
  const userIDs = top.map(user => user[ObtainableFields.user_id]);
  const users = await UsersService.find({ ids: userIDs });
  if(!users || !Array.isArray(users))
    return [];

  /* Get the user of each top record. */
  const topUsers: TopObtainables[] = [];
  for(const amounts of top)
  {
    /* Find the user of the points. */
    let pointsUser;
    for(const user of users)
    {
      if(user.id === amounts[ObtainableFields.user_id])
      {
        pointsUser = user;
        break;
      }
    }

    if(!pointsUser)
      continue;

    topUsers.push({
      userID: pointsUser.id,
      discordID: pointsUser.discordID,
      twitchID: pointsUser.twitchID,
      amount: amounts[ObtainableFields.amount],
    });
  }

  return topUsers;
}

export function getTopPoints({
  count,
  discordGuildID,
  twitchChannelID,
}: {
  count: number,
  discordGuildID?: string,
  twitchChannelID?: string,
})
{
  return getTopObtainables({ count, discordGuildID, twitchChannelID });
}

export function getTopCollectibles({
  count,
  discordGuildID,
  twitchChannelID,
}: {
  count: number,
  discordGuildID?: string,
  twitchChannelID?: string,
})
{
  return getTopObtainables({ count, isCollectible: true, discordGuildID, twitchChannelID });
}
