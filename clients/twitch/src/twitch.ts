require('dotenv').config();

import { initChatBot, client } from './chatbot/initChatBot';
import { initEventSub } from './eventsub/initEventSub';

(async () =>
{
  await initChatBot();
  await initEventSub(client);
})();
