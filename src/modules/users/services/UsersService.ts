import { supabase } from '../../../common/supabase-client';
import { nanoid } from '../../../common/nanoid';

const users = () => supabase.from<UserRecord>('users');
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
  } : {
    discordID?: string,
    twitchID?: string,
  } = {}): Promise<string>
  {
    if(! discordID && ! twitchID)
      throw new Error('No Discord or Twitch ID provided.');

    const user =
    {
      [UsersFields.id]: nanoid(15),
      [UsersFields.discord_id]: discordID,
      [UsersFields.twitch_id]: twitchID,
    };

    const { data, error } = await users().insert(user);
    if(error)
      throw error;

    const createdUser = data?.pop();
    if(! createdUser)
      throw new Error('User not created');

    return createdUser.id;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async findByID(ids: string | string[]): Promise<User[]>
  {
    ids = `(${(Array.isArray(ids) ? ids : [ ids ]).join(',')})`;

    const { data, error } = await users()
      .select()
      .or(
        `${UsersFields.id}.in.${ids},`
        + `${UsersFields.discord_id}.in.${ids},`
        + `${UsersFields.twitch_id}.in.${ids}`
      );

    if(error)
      throw error;

    if(! data || data.length === 0)
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
  } : {
    ids?: string | string[],
    discordIDs?: string | string[],
    twitchIDs?: string | string[],
  }): Promise<User[]>
  {
    const query = users()
      .select();

    if(ids)
      query.in(UsersFields.id, Array.isArray(ids) ? ids : [ ids ]);

    if(discordIDs)
      query.in(UsersFields.discord_id, Array.isArray(discordIDs) ? discordIDs : [ discordIDs ]);

    if(twitchIDs)
      query.in(UsersFields.twitch_id, Array.isArray(twitchIDs) ? twitchIDs : [ twitchIDs ]);

    const { data, error } = await query;
    if(error)
      throw error;

    if(! data || data.length === 0)
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
    { discordID, twitchID }: { discordID?: string, twitchID?: string }
  )
  {
    const updateData: any = {};
    if(discordID)
      updateData[UsersFields.discord_id] = discordID;

    if(twitchID)
      updateData[UsersFields.twitch_id] = twitchID;

    const { error } = await users()
      .update(updateData)
      .match({ [UsersFields.id]: id });

    if(error)
      throw error;
  }
}
