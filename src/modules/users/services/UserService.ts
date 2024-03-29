import { DB, TimestampedRecord } from '../../../common/DB';
import { nanoid } from '../../../common/nanoid';

export enum UserField
{
  id = 'id',
  discord_id = 'discord_id',
  twitch_id = 'twitch_id',
};

export interface UserRecord extends TimestampedRecord
{
  [UserField.id]: string;
  [UserField.discord_id]?: string;
  [UserField.twitch_id]?: string;
}

export interface User
{
  id: string;
  discordId?: string;
  twitchId?: string;
}

export class UserService
{
  /* Table name is added here to be able to use in joins in other services. */
  static table = 'users';

  /* Creates a user record. */
  static async create({
    discordId,
    twitchId,
  }: {
    discordId?: string,
    twitchId?: string,
  } = {}): Promise<string>
  {
    if(!discordId && !twitchId)
      throw new Error('No Discord or Twitch ID provided.');

    const user =
    {
      [UserField.id]: nanoid(15),
      [UserField.discord_id]: discordId,
      [UserField.twitch_id]: twitchId,
    };

    const data = await DB.users().insert(user).returning('*');
    const createdUser = data?.pop();
    if(!createdUser)
      throw new Error('User not created');

    return createdUser.id;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async findById(ids: string | string[]): Promise<User[]>
  {
    ids = Array.isArray(ids) ? ids : [ids];

    const data = await DB.users()
      .or.whereIn(UserField.id, ids)
      .or.whereIn(UserField.discord_id, ids)
      .or.whereIn(UserField.twitch_id, ids);

    if(!data || data.length === 0)
      return [];

    return data.map(user => ({
      id: user[UserField.id],
      discordId: user[UserField.discord_id],
      twitchId: user[UserField.twitch_id],
    }));
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async find({
    ids,
    discordIds,
    twitchIds,
  }: {
    ids?: string | string[],
    discordIds?: string | string[],
    twitchIds?: string | string[],
  }): Promise<User[]>
  {
    const query = DB.users();
    if(ids)
      query.whereIn(UserField.id, Array.isArray(ids) ? ids : [ids]);

    if(discordIds)
      query.whereIn(UserField.discord_id, Array.isArray(discordIds) ? discordIds : [discordIds]);

    if(twitchIds)
      query.whereIn(UserField.twitch_id, Array.isArray(twitchIds) ? twitchIds : [twitchIds]);

    const data = await query;
    if(!data || data.length === 0)
      return [];

    return data.map(user => ({
      id: user[UserField.id],
      discordId: user[UserField.discord_id],
      twitchId: user[UserField.twitch_id],
    }));
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async updateById(
    id: string,
    { discordId, twitchId }: { discordId?: string, twitchId?: string; }
  )
  {
    const updateData: any = {};
    if(discordId)
      updateData[UserField.discord_id] = discordId;

    if(twitchId)
      updateData[UserField.twitch_id] = twitchId;

    await DB.users()
      .update(updateData)
      .where(UserField.id, id);
  }
};
