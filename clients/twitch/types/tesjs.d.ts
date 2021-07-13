declare module 'tesjs'
{
  export type TESConfig =
  {
    identity:
    {
      id: string;
      secret: string;
    };
    listener:
    {
      baseURL: string;
      port: number;
      server?: any;
      ignoreDuplicateMessages?: boolean;
      ignoreOldMessages?: boolean;
    };
    options?:
    {
      debug?: boolean;
      logging?: boolean;
    };
  };

  export type EventSubSubscription =
  {
    data:
    {
      id: string;
      transport:
      {
        callback: string;
      };
    }[];
  };

  export type Reward =
  {

  };

  export type RewardRedemptionAddEvent =
  {
    id: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    user_id: string;
    user_login: string;
    user_name: string;
    user_input: string;
    status: string;
    reward:
    {
      id: string;
      title: string;
      cost: integer;
      prompt: string;
    };
    redeemed_at: string;
  };

  export type EventSubSubscribeCondition =
  {
    broadcaster_user_id: string;
  };

  export type RewardRedemptionEventHandler = (event: RewardRedemptionAddEvent) => void;

  class TES
  {
    constructor(config: TESConfig);

    baseUrl: string;

    subscribe(type: string, condition: any): Promise<EventSubSubscription>;
    unsubscribe(subscriptionIDorType: string, condition?: any): Promise<any>;
    getSubscriptionsByType(type: string, cursor?: string): Promise<EventSubSubscription>;

    on(type: string, callback: RewardRedemptionEventHandler);
  }

  export = TES;
}
