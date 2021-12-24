import { DB, TimestampedRecord } from '../../../common/DB';
import { nanoid } from '../../../common/nanoid';

export enum UsersFields
{
  id = 'id',
  discord_id = 'discord_id',
  twitch_id = 'twitch_id',
};

export interface UserRecord extends TimestampedRecord
{
  [UsersFields.id]: string;
  [UsersFields.discord_id]: string | null;
  [UsersFields.twitch_id]: string | null;
}

export interface User
{
  id: string;
  discordId?: string | null;
  twitchId?: string | null;
}

export class UsersService
{
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
      [UsersFields.id]: nanoid(15),
      [UsersFields.discord_id]: discordId,
      [UsersFields.twitch_id]: twitchId,
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
      .or.whereIn(UsersFields.id, ids)
      .or.whereIn(UsersFields.discord_id, ids)
      .or.whereIn(UsersFields.twitch_id, ids);

    if(!data || data.length === 0)
      return [];

    return data.map(user => ({
      id: user[UsersFields.id],
      discordId: user[UsersFields.discord_id],
      twitchId: user[UsersFields.twitch_id],
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
      query.whereIn(UsersFields.id, Array.isArray(ids) ? ids : [ids]);

    if(discordIds)
      query.whereIn(UsersFields.discord_id, Array.isArray(discordIds) ? discordIds : [discordIds]);

    if(twitchIds)
      query.whereIn(UsersFields.twitch_id, Array.isArray(twitchIds) ? twitchIds : [twitchIds]);

    const data = await query;
    if(!data || data.length === 0)
      return [];

    return data.map(user => ({
      id: user[UsersFields.id],
      discordId: user[UsersFields.discord_id],
      twitchId: user[UsersFields.twitch_id],
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
      updateData[UsersFields.discord_id] = discordId;

    if(twitchId)
      updateData[UsersFields.twitch_id] = twitchId;

    await DB.users()
      .update(updateData)
      .where(UsersFields.id, id);
  }
};
