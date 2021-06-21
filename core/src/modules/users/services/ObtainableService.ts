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

  async getObtainable(userUUID: string, isCollectible?: boolean)
  {
    const { data, error } = await obtainables()
      .select()
      .eq(ObtainableFields.user_uuid, userUUID)
      .is(ObtainableFields.is_collectible, isCollectible ? true : false);

    if(error)
      throw error;

    return data?.pop()?.amount;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async updateObtainables(userUUID: string, amount: number, isCollectible?: boolean): Promise<void>
  {
    const { error } = await obtainables()
      .update({ [ObtainableFields.amount]: amount })
      .match({ [ObtainableFields.user_uuid]: userUUID })
      .is(ObtainableFields.is_collectible, isCollectible ? true : false);

    if(error)
      throw error;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async getTop({
    count,
    isCollectible,
    discordGuildID,
  } : {
    count: number,
    isCollectible?: boolean,
    discordGuildID?: string,
  })
  {
    const query = obtainables()
      .select()
      .order(ObtainableFields.amount, { ascending: false })
      .is(ObtainableFields.is_collectible, isCollectible ? true : false)
      .limit(count);

    if(discordGuildID)
      query.eq(ObtainableFields.discord_guild_id, discordGuildID);

    const { data, error } = await query;
    if(error)
      throw error;

    return data;
  }
}
