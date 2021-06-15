interface TimestampedRecord
{
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

interface UserRecord extends TimestampedRecord
{
  uuid: string;
  discord_id: string | null;
}

interface ObtainableRecord extends TimestampedRecord
{
  user_uuid: string;
  discord_guild_id?: string;
  amount: number;
  is_collectible?: boolean;
}
