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

    let [ user, amount ] = parseParamsToArray(params);
    if(! user)
      return message.channel.send('Add points to who?');

    user = getIdFromMention(user);
    const value = parseFloat(amount);

    if(! amount || isNaN(value))
      return message.channel.send('Please include the amount.');

    try
    {
      await addPointsToUser(user, message.guild.id, value);
      // TODO: Update message
      message.channel.send(`Added ${amount} to ${user}.`);
    }
    catch(error)
    {
      console.log(error);
      message.channel.send('Could not add points.');
    }
  },
};