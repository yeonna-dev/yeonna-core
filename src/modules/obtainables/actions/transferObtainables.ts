import { ContextUtil } from '../../../common/ContextUtil';
import { NotEnoughCollectibles, NotEnoughPoints } from '../../../common/errors';
import { findOrCreateUser, findUser } from '../../users/actions';
import { ObtainableService } from '../services/ObtainableService';
import { getObtainables } from './getObtainables';

export async function transferObtainables({
  fromUserIdentifier,
  toUserIdentifier,
  amount,
  isCollectible,
  discordGuildId,
  twitchChannelId,
}: {
  fromUserIdentifier: string,
  toUserIdentifier: string,
  amount: number,
  isCollectible?: boolean,
  discordGuildId?: string,
  twitchChannelId?: string,
}): Promise<void>
{
  if(!discordGuildId && !twitchChannelId)
    throw new Error('No Discord Guild ID or Twitch Channel ID provided');

  amount = Math.abs(amount);

  /* Get the obtainables of the user to get obtainables from (source user) */
  const source = await findUser(fromUserIdentifier);
  if(!source)
    throw new (isCollectible ? NotEnoughCollectibles : NotEnoughPoints)();

  const sourceObtainables = await getObtainables({
    userIdentifier: source,
    isCollectible,
    discordGuildId,
    twitchChannelId,
  });

  /* Check if the source user has less obtainables than the given amount. */
  if(!sourceObtainables || sourceObtainables < amount)
    throw new (isCollectible ? NotEnoughCollectibles : NotEnoughPoints)();

  /* Get the obtainables of user to add obtainables to (target user). */
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
    isCollectible,
    discordGuildId,
    twitchChannelId,
  });

  const context = ContextUtil.createContext({ discordGuildId, twitchChannelId });
  if(!targetObtainables)
    await ObtainableService.create({
      userId: target,
      amount,
      isCollectible,
      context,
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
    userId: source,
    amount: sourceObtainables - amount,
    isCollectible,
    context,
  });
}

export async function transferUserPoints({
  fromUserIdentifier,
  toUserIdentifier,
  amount,
  discordGuildId,
  twitchChannelId,
}: {
  fromUserIdentifier: string,
  toUserIdentifier: string,
  amount: number,
  discordGuildId?: string,
  twitchChannelId?: string,
}): Promise<void>
{
  await transferObtainables({
    fromUserIdentifier,
    toUserIdentifier,
    amount,
    discordGuildId,
    twitchChannelId,
  });
}

export async function transferUserCollectibles({
  fromUserIdentifier,
  toUserIdentifier,
  amount,
  discordGuildId,
  twitchChannelId,
}: {
  fromUserIdentifier: string,
  toUserIdentifier: string,
  amount: number,
  discordGuildId?: string,
  twitchChannelId?: string,
}): Promise<void>
{
  await transferObtainables({
    fromUserIdentifier,
    toUserIdentifier,
    amount,
    discordGuildId,
    twitchChannelId,
    isCollectible: true,
  });
}
