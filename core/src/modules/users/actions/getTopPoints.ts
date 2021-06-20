import { ObtainableService, ObtainableFields } from '../services/ObtainableService';
import { UsersService } from '../services/UsersService';

type TopPoints =
{
  userUUID: string;
  discordID?: string | null;
  points: number;
};

export async function getTopPoints(count: number, discordGuildID?: string): Promise<TopPoints[]>
{
  /* Get top points. */
  const top = await ObtainableService.getTop(count, discordGuildID);
  if(! top)
    return [];

  /* Get users of top points. */
  const userUUIDs = top.map(user => user[ObtainableFields.user_uuid]);
  const users = await UsersService.findByUUID(userUUIDs);
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
      if(user.uuid === points[ObtainableFields.user_uuid])
      {
        pointsUser = user;
        break;
      }
    }

    if(! pointsUser)
      continue;

    topUsers.push({
      userUUID: pointsUser.uuid,
      discordID: pointsUser.discordID,
      points: points[ObtainableFields.amount],
    });
  }

  return topUsers;
}
