import { supabase } from '../../../common/supabase-client';

const obtainables = () => supabase.from<ObtainableRecord>('obtainables');
export enum ObtainableFields
{
  user_uuid = 'user_uuid',
  amount = 'amount',
  is_collectible = 'is_collectible',
  discord_guild_id = 'discord_guild_id',
  twitch_channel_id = 'twitch_channel_id',
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
    twitchChannelID,
  } : {
    userUUID: string,
    amount: number,
    isCollectible?: boolean,
    discordGuildID?: string,
    twitchChannelID?: string,
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

    if(twitchChannelID)
      insertData.twitch_channel_id = twitchChannelID;

    const { data, error } = await obtainables().insert(insertData);
    if(error)
      throw error;

    const obtainableRecord = data?.pop();
    if(! obtainableRecord)
      throw new Error('Obtainable record not created');

    return true;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async getObtainable({
    userUUID,
    isCollectible,
    discordGuildID,
    twitchChannelID,
  } : {
    userUUID: string,
    isCollectible?: boolean,
    discordGuildID?: string,
    twitchChannelID?: string,
  })
  {
    const query = obtainables()
      .select()
      .eq(ObtainableFields.user_uuid, userUUID)
      .is(ObtainableFields.is_collectible, isCollectible ? true : false);

    if(discordGuildID)
      query.eq(ObtainableFields.discord_guild_id, discordGuildID);

    if(twitchChannelID)
      query.eq(ObtainableFields.twitch_channel_id, twitchChannelID);


    const { data, error } = await query;
    if(error)
      throw error;

    return data?.pop()?.amount;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async updateObtainables({
    userUUID,
    amount,
    isCollectible,
    discordGuildID,
    twitchChannelID,
  } : {
    userUUID: string,
    amount: number,
    isCollectible?: boolean,
    discordGuildID?: string,
    twitchChannelID?: string,
  }): Promise<void>
  {
    const query = obtainables()
      .update({ [ObtainableFields.amount]: amount })
      .match({ [ObtainableFields.user_uuid]: userUUID })
      .is(ObtainableFields.is_collectible, isCollectible ? true : false);

    if(discordGuildID)
      query.eq(ObtainableFields.discord_guild_id, discordGuildID);

    if(twitchChannelID)
      query.eq(ObtainableFields.twitch_channel_id, twitchChannelID);

    const { error } = await query;
    if(error)
      throw error;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async getTop({
    count,
    isCollectible,
    discordGuildID,
    twitchChannelID,
  } : {
    count: number,
    isCollectible?: boolean,
    discordGuildID?: string,
    twitchChannelID?: string,
  })
  {
    const query = obtainables()
      .select()
      .order(ObtainableFields.amount, { ascending: false })
      .is(ObtainableFields.is_collectible, isCollectible ? true : false)
      .limit(count);

    if(discordGuildID)
      query.eq(ObtainableFields.discord_guild_id, discordGuildID);

    if(twitchChannelID)
      query.eq(ObtainableFields.twitch_channel_id, twitchChannelID);

    const { data, error } = await query;
    if(error)
      throw error;

    return data;
  }
}
