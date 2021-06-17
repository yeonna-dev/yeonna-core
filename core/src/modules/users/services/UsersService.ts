import { supabase } from '../../../common/supabase-client';
import { v4 as generateUUID } from 'uuid';

const users = () => supabase.from<UserRecord>('users');
enum Columns
{
  uuid = 'uuid',
  discord_id = 'discord_id',
  created_at = 'created_at',
  updated_at = 'updated_at',
  deleted_at = 'deleted_at',
};

export const UsersService = new class
{
  /* Creates a user record. */
  async create({ discordID }: { discordID?: string } = {}): Promise<string>
  {
    const user =
    {
      uuid: generateUUID(),
      discord_id: discordID,
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

  /* Gets the user with the given Discord ID. */
  async getByDiscordID(discordID: string): Promise<User | undefined>
  {
    const { data, error } = await users()
      .select()
      .filter(Columns.discord_id, 'eq', discordID);

    if(error)
      throw error;

    const user = data?.pop();
    if(! user)
      return;

    return ({
      uuid: user.uuid,
      discordID: user.discord_id,
    });
  }
}
