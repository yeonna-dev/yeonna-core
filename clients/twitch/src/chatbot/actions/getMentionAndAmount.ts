import { parseParamsToArray } from 'comtroller';
import { API } from '../../api';
import { ChatContext } from '../../utilities/ChatContext';

export async function getMentionedUserAndAmount(context: ChatContext, params: string)
{
  const channel = context.tags['room-id'];
  if(! channel)
    return;

  const [ mentioned, amountString ] = parseParamsToArray(params);
  if(! mentioned && ! amountString)
    return;

  let amount = parseInt(amountString);
  if(isNaN(amount))
    return context.send('please enter the amount');

  const user = await API.getUserByName(mentioned.replace(/@/g, ''));
  if(! user)
    return;

  return { user, amount, channel };
}
