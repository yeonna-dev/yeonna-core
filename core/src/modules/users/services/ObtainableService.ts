import { supabase } from '../../../common/supabase-client';

const obtainables = () => supabase.from<ObtainableRecord>('obtainables');
export enum ObtainableFields
{
  user_uuid = 'user_uuid',
  discord_guild_id = 'discord_guild_id',
  amount = 'amount',
  is_collectible = 'is_collectible',
  created_at = 'created_at',
  updated_at = 'updated_at',
  deleted_at = 'deleted_at',
}

export const ObtainableService = new class
{
  /* Creates an obtainable record */
  async createObtainable({
    userUUID,
    amount = 0,
    isCollectible,
    discordGuildID,
  } : {
    userUUID: string,
    amount: number,
    isCollectible?: boolean,
    discordGuildID?: string,
  }): Promise<Boolean>
  {
    const insertData: ObtainableRecord =
    {
      user_uuid: userUUID,
      amount,
      is_collectible: isCollectible,
    };

    if(discordGuildID)
      insertData.discord_guild_id = discordGuildID;

    const { data, error } = await obtainables().insert(insertData);
    if(error)
      throw error;

    const obtainableRecord = data?.pop();
    if(! obtainableRecord)
      throw new Error('Obtainable record not created');

    return true;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /* Gets the points of the user with the given UUID. */
  async getPoints(userUUID: string): Promise<number | undefined>
  {
    const { data, error } = await obtainables()
      .select()
      .filter(ObtainableFields.user_uuid, 'eq', userUUID);

    if(error)
      throw error;

    return data?.pop()?.amount;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async updatePoints(userUUID: string, amount: number): Promise<void>
  {
    const { error } = await obtainables()
      .update({ [ObtainableFields.amount]: amount })
      .match({ [ObtainableFields.user_uuid]: userUUID });

    if(error)
      throw error;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async getTop({
    count,
    collectible,
    discordGuildID,
  } : {
    count: number,
    collectible?: boolean,
    discordGuildID?: string,
  })
  {
    const query = obtainables()
      .select()
      .order(ObtainableFields.amount, { ascending: false })
      .limit(count)

    if(collectible)
      query.filter(ObtainableFields.is_collectible, 'eq', true);

    if(discordGuildID)
      query.filter(ObtainableFields.discord_guild_id, 'eq', discordGuildID);

    const { data, error } = await query;
    if(error)
      throw error;

    return data;
  }
}
