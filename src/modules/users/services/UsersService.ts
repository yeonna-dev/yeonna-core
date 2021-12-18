import { DB } from '../../../common/DB';
import { nanoid } from '../../../common/nanoid';

export enum UsersFields
{
  id = 'id',
  discord_id = 'discord_id',
  twitch_id = 'twitch_id',
  created_at = 'created_at',
  updated_at = 'updated_at',
  deleted_at = 'deleted_at',
};

export const UsersService = new class
{
  /* Creates a user record. */
  async create({
    discordID,
    twitchID,
  }: {
    discordID?: string,
    twitchID?: string,
  } = {}): Promise<string>
  {
    if(!discordID && !twitchID)
      throw new Error('No Discord or Twitch ID provided.');

    const user =
    {
      [UsersFields.id]: nanoid(15),
      [UsersFields.discord_id]: discordID,
      [UsersFields.twitch_id]: twitchID,
    };

    const data = await DB.users().insert(user).returning('*');
    const createdUser = data?.pop();
    if(!createdUser)
      throw new Error('User not created');

    return createdUser.id;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async findByID(ids: string | string[]): Promise<User[]>
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
      discordID: user[UsersFields.discord_id],
      twitchID: user[UsersFields.twitch_id],
    }));
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async find({
    ids,
    discordIDs,
    twitchIDs,
  }: {
    ids?: string | string[],
    discordIDs?: string | string[],
    twitchIDs?: string | string[],
  }): Promise<User[]>
  {
    const query = DB.users();
    if(ids)
      query.whereIn(UsersFields.id, Array.isArray(ids) ? ids : [ids]);

    if(discordIDs)
      query.whereIn(UsersFields.discord_id, Array.isArray(discordIDs) ? discordIDs : [discordIDs]);

    if(twitchIDs)
      query.whereIn(UsersFields.twitch_id, Array.isArray(twitchIDs) ? twitchIDs : [twitchIDs]);

    const data = await query;
    if(!data || data.length === 0)
      return [];

    return data.map(user => ({
      id: user[UsersFields.id],
      discordID: user[UsersFields.discord_id],
      twitchID: user[UsersFields.twitch_id],
    }));
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async updateByID(
    id: string,
    { discordID, twitchID }: { discordID?: string, twitchID?: string; }
  )
  {
    const updateData: any = {};
    if(discordID)
      updateData[UsersFields.discord_id] = discordID;

    if(twitchID)
      updateData[UsersFields.twitch_id] = twitchID;

    await DB.users()
      .update(updateData)
      .where(UsersFields.id, id);
  }
};
