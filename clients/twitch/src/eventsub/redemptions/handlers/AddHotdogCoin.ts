import { Command } from 'comtroller';
import { RewardRedemptionAddEvent } from 'tesjs';
import { addPoints } from '../../actions/addPoints';

export const AddHotdogCoin: Command =
{
  name: 'AddHotdogCoin',
  run: async ({ event } : { event: RewardRedemptionAddEvent }) => addPoints(event),
};
