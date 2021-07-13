import { Command } from 'comtroller';

import { ChatContext } from '../../utilities/ChatContext';

export const addpoints: Command =
{
  name: 'addpoints',
  run: ({ context }: { context: ChatContext }) =>
  {
    console.log(context.tags);
    console.log(context.message);
  },
};
