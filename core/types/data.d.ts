interface User
{
  uuid: string;
  discordID?: string | null;
}

interface DiscordGuild
{
  discordID: string;
  pointsName: string;
  collectiblesName: string;
}

interface Bit
{
  uuid: string;
  content: string;
}

interface UserBit
{
  userUUID: string;
  bitUUID: string;
}

interface Obtainable
{
  userUUID: string;
  discordGuildID: string;
  amount: number;
  isCollectible?: boolean;
}
