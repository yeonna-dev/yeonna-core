import { supabase } from '../../../common/supabase-client';
import { v4 as generateUUID } from 'uuid';

const users = () => supabase.from<UserRecord>('users');
export enum UsersFields
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
  async create({ discordID }: { discordID?: string | null } = {}): Promise<string>
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

  private async find(
    identifier: string | string[],
    filterColumn: keyof UserRecord,
  ): Promise<User | User[] | undefined>
  {
    let query = users()
      .select();

    const { data, error } = await (
      Array.isArray(identifier)
        ? query.in(filterColumn, identifier)
        : query.filter(filterColumn, 'eq', identifier)
    );

    if(error)
    {
      /* Error with code `22P02` means the given identifier is not a UUID,
        so it might be a Discord ID. */
      if(error.code === '22P02')
        return;

      throw error;
    }

    if(Array.isArray(identifier))
      return data?.map(user => ({
        uuid: user[UsersFields.uuid],
        discordID: user[UsersFields.discord_id],
      }));

    const user = data?.pop();
    if(! user)
      return;

    return ({
      uuid: user.uuid,
      discordID: user.discord_id,
    });
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async findByUUID(uuid: string | string[])
  {
    return this.find(uuid, UsersFields.uuid);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /* Gets the user with the given Discord ID. */
  async findByDiscordID(discordID: string)
  {
    return this.find(discordID, UsersFields.discord_id);
  }
}
