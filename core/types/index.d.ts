/* Data */

interface User
{
  id: string;
  discordID?: string | null;
  twitchID?: string | null;
}

interface Obtainable
{
  userID: string;
  amount: number;
  context?: string;
  isCollectible?: boolean;
}

interface Item
{
  categoryID?: string;
  code: string;
  name: string;
  chanceMin?: number;
  chanceMax?: number;
  price?: number;
  image?: string;
  emote?: string;
}

interface Inventory
{
  itemCode: string;
  amount: number;
  context?: string;
}

interface InventoryItem extends Item
{
  amount: number;
  context?: string;
}

interface DiscordGuild
{
  discordID: string;
  pointsName: string;
  collectiblesName: string;
}

interface Bit
{
  id: string;
  content: string;
}

interface UserBit
{
  userID: string;
  bitID: string;
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/* Database */

interface TimestampedRecord
{
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

interface UserRecord extends TimestampedRecord
{
  id: string;
  discord_id: string | null;
  twitch_id: string | null;
}

interface ObtainableRecord extends TimestampedRecord
{
  user_id: string;
  amount: number;
  context?: string;
  is_collectible?: boolean;
}

interface ItemRecord extends TimestampedRecord
{
  category_id?: string;
  code: string;
  name: string;
  chance_min?: number;
  chance_max?: number;
  price?: number;
  image?: string;
  emote?: string;
}

interface InventoryRecord extends TimestampedRecord
{
  pk_id: number;
  user_id: string;
  item_code: string;
  amount: number;
  context?: string;
}
