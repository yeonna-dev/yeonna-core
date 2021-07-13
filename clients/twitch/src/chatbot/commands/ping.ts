import { Command } from 'comtroller';

import { ChatContext } from '../../utilities/ChatContext';

export const ping: Command =
{
  name: 'ping',
  run: async ({ context }: { context: ChatContext }) =>
  {
    context.send('Pong!');
  },
};
