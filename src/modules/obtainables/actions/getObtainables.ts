import { withUserAndContext } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { ObtainableService } from '../services/ObtainableService';

export const getObtainables = async ({
  isCollectible,
  ...identifiers
}: Identifiers & { isCollectible?: boolean; }) => withUserAndContext(identifiers)(
  async (userId, context) =>
  {
    const obtainables = await ObtainableService.find({
      userId,
      context,
      isCollectible,
    });

    return obtainables || 0;
  }
);

export const getPoints = (identifiers: Identifiers) =>
  getObtainables(identifiers);

export const getCollectibles = (identifiers: Identifiers) =>
  getObtainables({ ...identifiers, isCollectible: true });
