import { NotEnoughCollectibles, NotEnoughPoints } from '../../../common/errors';
import { withUserAndContext } from '../../../common/providers';
import { findOrCreateUser } from '../../users/actions';
import { ObtainableService } from '../services/ObtainableService';
import { getObtainables } from './getObtainables';

type TransferObtainablesParameters = {
  fromUserIdentifier: string;
  toUserIdentifier: string;
  discordGuildId?: string;
  twitchChannelId?: string;
  amount: number;
  isCollectible?: boolean;
};

export const transferObtainables = async ({
  fromUserIdentifier,
  toUserIdentifier,
  discordGuildId,
  twitchChannelId,
  amount,
  isCollectible,
}: TransferObtainablesParameters): Promise<void> => withUserAndContext({
  userIdentifier: fromUserIdentifier,
  discordGuildId,
  twitchChannelId,
})(
  async (userId, context) =>
  {
    if(!userId)
      throw new (isCollectible ? NotEnoughCollectibles : NotEnoughPoints)();

    amount = Math.abs(amount);

    /* Get the obtainables of the user to get obtainables from (source user) */
    const sourceObtainables = await getObtainables({
      userIdentifier: userId,
      discordGuildId,
      twitchChannelId,
      isCollectible,
    });

    /* Check if the source user has less obtainables than the given amount. */
    if(!sourceObtainables || sourceObtainables < amount)
      throw new (isCollectible ? NotEnoughCollectibles : NotEnoughPoints)();

    const target = await findOrCreateUser({
      userIdentifier: toUserIdentifier,
      discordGuildId,
      twitchChannelId,
    });

    if(!target)
      throw new Error('Cannot transfer points');

    /* Add obtainables to the target user. */
    const targetObtainables = await getObtainables({
      userIdentifier: target,
      discordGuildId,
      twitchChannelId,
      isCollectible,
    });

    if(!targetObtainables)
      await ObtainableService.create({
        userId: target,
        amount,
        isCollectible,
      });
    else
      await ObtainableService.update({
        userId: target,
        amount: targetObtainables + amount,
        isCollectible,
        context,
      });

    /* Subtract obtainables from the source user. */
    await ObtainableService.update({
      userId,
      amount: sourceObtainables - amount,
      isCollectible,
      context,
    });
  },
  {
    silentErrors: true,
    requireContextParameters: true,
  }
);

export const transferUserPoints = async (
  parameters: Omit<TransferObtainablesParameters, 'isCollectible'>
): Promise<void> =>
  await transferObtainables(parameters);

export const transferUserCollectibles = async (
  parameters: Omit<TransferObtainablesParameters, 'isCollectible'>
): Promise<void> =>
  await transferObtainables({
    ...parameters,
    isCollectible: true,
  });
