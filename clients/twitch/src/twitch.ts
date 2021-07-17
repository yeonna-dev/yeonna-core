require('dotenv').config();

import { initChatBot } from './chatbot/initChatBot';
import { initEventSub } from './eventsub/initEventSub';

(async () =>
{
  await initChatBot();
  await initEventSub();
})();
