import { Command } from 'comtroller';
import { RewardRedemptionAddEvent } from 'tesjs';
import { addPoints } from '../../actions/addPoints';

export const AddHotdogCoin1000: Command =
{
  name: 'AddHotdogCoin1000',
  run: ({ event } : { event: RewardRedemptionAddEvent }) => addPoints(event),
};
