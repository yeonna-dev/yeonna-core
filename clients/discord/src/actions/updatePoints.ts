import { Message } from 'discord.js';
import { parseParamsToArray } from 'comtroller';

import { updateUserPoints } from '../../../../core/src';

import { getIdFromMention } from '../helpers/getIdFromMention';

export async function updatePoints({
  message,
  params,
  daily,
  overwrite,
}: {
  message: Message,
  params: string,
  daily?: number,
  overwrite?: boolean
})
{
  if(! message.guild)
    return message.channel.send('This command can only be used in a guild.');

  let user, amount;
  if(daily)
  {
    user = message.author.id;
    amount = daily;
  }
  else
  {
    const [ userString, amountString ] = parseParamsToArray(params);
    if(! userString)
      return message.channel.send(overwrite
        ? 'Set points of who?'
        : 'Add points to who?'
      );

    user = getIdFromMention(userString);
    amount = parseFloat(amountString);

    /* Check if the given value is a valid number. */
    if(! amountString || isNaN(amount) || ! /^\d+(\.\d+)?$/g.test(amountString))
      return message.channel.send('Please include the amount.');
  }

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
      ? `Set points of ${member.displayName} to ${amount}`
      : `Added ${amount} to ${member.displayName}.`
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
