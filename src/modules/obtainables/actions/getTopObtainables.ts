import { withContext } from '../../../common/providers';
import { ContextParameters } from '../../../common/types';
import { ObtainableService } from '../services/ObtainableService';

type GetTopObtainablesParameters = ContextParameters & {
  count: number;
  isCollectible?: boolean,
};

type TopObtainables = {
  userId: string;
  discordId?: string;
  twitchId?: string;
  amount: number;
};

export const getTopObtainables = async ({
  count,
  isCollectible,
  ...contextParameters
}: GetTopObtainablesParameters): Promise<TopObtainables[] | undefined> =>
  withContext(contextParameters)(
    async (context) =>
    {
      const topObtainables = await ObtainableService.getTop({
        count,
        isCollectible,
        context,
        withUsers: true,
      });

      return topObtainables.map(({ user, amount }) => ({
        userId: user.id,
        discordId: user.discordId,
        twitchId: user.twitchId,
        amount,
      }));
    }
  );

export const getTopPoints = (
  parameters: Omit<GetTopObtainablesParameters, 'isCollectible'>
) => getTopObtainables(parameters);

export const getTopCollectibles = (
  parameters: Omit<GetTopObtainablesParameters, 'isCollectible'>
) => getTopObtainables({ ...parameters, isCollectible: true });
