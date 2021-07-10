import { ObtainableService, ObtainableFields } from '../services/ObtainableService';
import { UsersService } from '../services/UsersService';

type TopPoints =
{
  userID: string;
  discordID?: string | null;
  twitchID?: string | null;
  points: number;
};

// TODO: Join getting users with obtainables
export async function getTopObtainables({
  count,
  isCollectible,
  discordGuildID,
  twitchChannelID,
} : {
  count: number,
  isCollectible?: boolean,
  discordGuildID?: string,
  twitchChannelID?: string,
}): Promise<TopPoints[]>
{
  /* Get top points. */
  const top = await ObtainableService.getTop({
    count,
    discordGuildID,
    twitchChannelID,
    isCollectible,
  });

  if(! top)
    return [];

  /* Get users of top points. */
  const userIDs = top.map(user => user[ObtainableFields.user_id]);
  const users = await UsersService.find({ ids: userIDs });
  if(! users || ! Array.isArray(users))
    return [];

  /* Get the user of each top record. */
  const topUsers: TopPoints[] = [];
  for(const points of top)
  {
    /* Find the user of the points. */
    let pointsUser;
    for(const user of users)
    {
      if(user.id === points[ObtainableFields.user_id])
      {
        pointsUser = user;
        break;
      }
    }

    if(! pointsUser)
      continue;

    topUsers.push({
      userID: pointsUser.id,
      discordID: pointsUser.discordID,
      twitchID: pointsUser.twitchID,
      points: points[ObtainableFields.amount],
    });
  }

  return topUsers;
}

export function getTopPoints({
  count,
  discordGuildID,
  twitchChannelID,
} : {
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
} : {
  count: number,
  discordGuildID?: string,
  twitchChannelID?: string,
})
{
  return getTopObtainables({ count, isCollectible: true, discordGuildID, twitchChannelID });
}
