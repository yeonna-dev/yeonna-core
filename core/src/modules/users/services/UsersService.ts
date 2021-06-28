import { supabase } from '../../../common/supabase-client';
import { v4 as generateUUID } from 'uuid';

const users = () => supabase.from<UserRecord>('users');
export enum UsersFields
{
  uuid = 'uuid',
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
      [UsersFields.uuid]: generateUUID(),
      [UsersFields.discord_id]: discordID,
      [UsersFields.twitch_id]: twitchID,
    };

    const { data, error } = await users().insert(user);
    if(error)
      throw error;

    const createdUser = data?.pop();
    if(! createdUser)
      throw new Error('User not created');

    return createdUser.uuid;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async find({
    uuids,
    discordIDs,
    twitchIDs,
  } : {
    uuids?: string | string[],
    discordIDs?: string | string[],
    twitchIDs?: string | string[],
  }): Promise<User[]>
  {
    const query = users()
      .select();

    if(uuids)
      query.in(UsersFields.uuid, Array.isArray(uuids) ? uuids : [ uuids ]);

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
      uuid: user[UsersFields.uuid],
      discordID: user[UsersFields.discord_id],
      twitchID: user[UsersFields.twitch_id],
    }));
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async updateByUUID(
    uuid: string,
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
      .match({ [UsersFields.uuid]: uuid });

    if(error)
      throw error;
  }
}
