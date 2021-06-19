import { Message } from 'discord.js';

export async function findGuildMember(message: Message, userDiscordID: string)
{
  if(! message.guild)
    return;

  let member;
  try
  {
    member = await message.guild.members.fetch(userDiscordID);
  }
  catch(error)
  {
    /* Error code `10013` is when the given user is an unknown user. */
    if(error.code !== 10013)
      console.error(error);
  }

  return member;
}
