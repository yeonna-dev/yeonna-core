import { RewardRedemptionAddEvent } from 'tesjs';
import { Comtroller } from 'comtroller';

import { loadNamedModules } from '../../utilities/helpers';

export class Redemptions
{
  public type: string = 'channel.channel_points_custom_reward_redemption.add';
  private comtroller: Comtroller | undefined;

  async init()
  {
    const redemptionHandlers = await loadNamedModules(`${__dirname}/handlers`);
    this.comtroller = new Comtroller({
      commands: redemptionHandlers,
      defaults:
      {
        prefix: '',
        caseSensitive: true,
      },
    });
  }

  listener = (event: RewardRedemptionAddEvent) =>
  {
    if(! this.comtroller)
      return;

    const rewardTitle = event.reward.title.replace(/\s/g, '');
    this.comtroller.run(rewardTitle, { event });
  }
}
