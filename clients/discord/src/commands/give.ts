import { Message } from 'discord.js';
import { Command, parseParamsToArray } from 'comtroller';

import { transferUserPoints, NotEnoughPoints } from '../../../../core/src';

import { findGuildMember } from '../actions/findGuildMember';

import { getIdFromMention } from '../helpers/getIdFromMention';
import { isNumber } from '../helpers/isNumber';

// TODO: Update responses
export const give: Command =
{
  name: 'give',
  aliases: [ 'pay' ],
  run: async ({ message, params }: { message: Message, params: string }) =>
  {
    if(! message.guild)
      return message.channel.send('This command can only be used in a guild.');

    /* Get the receiver user and amount. */
    let [ user, amountString ] = parseParamsToArray(params);
    if(! user)
      return message.channel.send('Transfer points to who?');

    /* Check if the given value is a valid number. */
    if(isNumber(amountString))
      return message.channel.send('Please include the amount.');

    message.channel.startTyping();

    /* Check if the receiver is a valid guild member. */
    user = getIdFromMention(user);
    const member = await findGuildMember(message, user);
    if(! member)
    {
      message.channel.stopTyping(true);
      return message.channel.send('User is not a member of this server.');
    }

    /* Transfer points. */
    const amount = parseFloat(amountString);
    try
    {
      await transferUserPoints(message.author.id, user, amount, message.guild.id);
      message.channel.send(`Transferred ${amount} points to ${member.displayName}.`);
    }
    catch(error)
    {
      if(error instanceof NotEnoughPoints)
        message.channel.send('Not enough points.');
      else
      {
        console.error(error);
        message.channel.send('Could not transfer points.');
      }
    }
    finally
    {
      message.channel.stopTyping(true);
    }
  },
};
