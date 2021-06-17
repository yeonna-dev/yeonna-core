import { Message } from 'discord.js';
import { parseParamsToArray } from 'comtroller';

import { updateUserPoints } from '../../../../core/src';

import { getIdFromMention } from '../helpers/getIdFromMention';

export async function updatePoints(message: Message, params: string, overwrite?: boolean)
{
  if(! message.guild)
    return message.channel.send('This command can only be used in a guild.');

  let [ user, value ] = parseParamsToArray(params);
  if(! user)
    return message.channel.send('Add points to who?');

  user = getIdFromMention(user);
  const amount = parseFloat(value);

  /* Check if the given value is a valid number. */
  if(! value || isNaN(amount) || ! /^[+-]?\d+(\.\d+)?$/g.test(value))
    return message.channel.send('Please include the amount.');

  message.channel.startTyping();

  let member;
  try
  {
    member = await message.guild.members.fetch(user);
  }
  catch(error)
  {
    /* Error code `10013` is when the given user is an unknown user. */
    if(error.code !== 10013)
      console.error(error);
  }

  if(! member)
  {
    message.channel.stopTyping(true);
    return message.channel.send('User is not a member of this server.');
  }

  try
  {
    await updateUserPoints({ user, amount, discordGuildID: message.guild.id, overwrite });
    // TODO: Update message
    message.channel.send(overwrite
      ? `Set points of ${member.displayName} to ${value}`
      : `Added ${value} to ${member.displayName}.`
    );
  }
  catch(error)
  {
    console.error(error);
    message.channel.send('Could not add points.');
  }
  finally
  {
    message.channel.stopTyping(true);
  }
}
