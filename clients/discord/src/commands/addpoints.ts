import { Message } from 'discord.js';
import { Command, parseParamsToArray } from 'comtroller';

import { addPointsToUser } from '../../../../core/src';

import { getIdFromMention } from '../helpers/getIdFromMention';

export const addpoints: Command =
{
  name: 'addpoints',
  run: async ({ message, params }: { message: Message, params: string }) =>
  {
    if(! message.guild)
      return message.channel.send('This command can only be used in a guild.');

    let [ user, value ] = parseParamsToArray(params);
    if(! user)
      return message.channel.send('Add points to who?');

    user = getIdFromMention(user);
    const amount = parseFloat(value);

    if(! value || isNaN(amount))
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
      await addPointsToUser({ user, amount, discordGuildID: message.guild.id });
      // TODO: Update message
      message.channel.send(`Added ${value} to ${user}.`);
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
  },
};