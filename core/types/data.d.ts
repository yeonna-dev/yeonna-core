interface User
{
  uuid: string;
  discordID: string;
}

interface DiscordGuild
{
  discordID: string;
  creditsName: string;
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
  isCollectible: boolean;
}
