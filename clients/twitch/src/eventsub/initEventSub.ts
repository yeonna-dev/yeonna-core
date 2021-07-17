import TES from 'tesjs';
import localtunnel from 'localtunnel';

import { Redemptions } from './redemptions/Redemptions';

import { client } from '../chatbot/initChatBot';
import { Log } from '../utilities/logger';

export async function initEventSub()
{
  const clientID = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  const broadcasterID = process.env.TWITCH_BROADCASTER_ID;
  const development = process.env.ENVIRONMENT === 'development';

  if(! clientID || ! clientSecret)
    throw new Error('Please provide the Twitch client ID and secret in the .env file');

  // TODO: Mag broadcaster ID configurable.
  if(! broadcasterID)
    throw new Error('Please provide the broadcaster ID in the .env file');

  let baseURL = process.env.EVENTSUB_LISTENER_URL;
  const port = parseInt(process.env.EVENTSUB_DEV_TUNNEL_PORT || '8080');

  /* Create a temporary tunnel for local dev if there's no provided event sub listener URL */
  if(! baseURL)
  {
    const tunnel = await localtunnel({ port });
    baseURL = tunnel.url;
  }

  const eventSubListener = new TES({
    identity:
    {
      id: clientID,
      secret: clientSecret,
    },
    listener:
    {
      baseURL,
      port,
    },
  });

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  /* Initialize subscriptions. */

  /* Initialize reward redemptions */
  const redemptions = new Redemptions();
  await redemptions.init();

  /*
    Initialize subscription event listeners.
    Each key of the `subscriptions` object is the EventSub subscription type,
    and the value is the event handler for the subscription type.
  */
  const subscriptions =
  [
    {
      type: redemptions.type,
      listener: redemptions.listener,
    },
  ];

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  /* Subscribe to EventSub events */

  for(const { type, listener } of subscriptions)
  {
    const subscriptionsData = await eventSubListener.getSubscriptionsByType(type);
    const subscriptionsOfThisType = subscriptionsData.data;

    let subscriptionForCurrentURL;

    for(const subscription of subscriptionsOfThisType)
    {
      if(subscription.transport.callback === `${eventSubListener.baseUrl}/teswh/event`)
        subscriptionForCurrentURL = subscription;

      /* Unsubscribe active subscription if in development. */
      if(development)
        await eventSubListener.unsubscribe(subscription.id);
    }

    /* Subscribe to the event type if there is no active subscription for the current URL. */
    if(! subscriptionForCurrentURL)
    {
      const subscription = await eventSubListener.subscribe(type, { broadcaster_user_id: broadcasterID });
      Log.info(`Subscribed to EventSub ${JSON.stringify(subscription, null, 2)}`, true);
    }

    /* Listen to the subscription events. */
    eventSubListener.on(type, listener);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  Log.info(`Listening to EventSub on ${baseURL}`, true);

  // TODO: Update
  if(client)
    client.say('#xjabee', 'gamba bro');
}
