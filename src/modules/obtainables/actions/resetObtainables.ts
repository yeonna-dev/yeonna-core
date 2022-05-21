import { withContext } from '../../../common/providers';
import { ContextParameters } from '../../../common/types';
import { Obtainable, ObtainableService } from '../services/ObtainableService';

type ResetObtainablesParameters = ContextParameters & { isCollectible?: boolean; };

export const resetObtainables = ({
  isCollectible,
  ...identifiers
}: ResetObtainablesParameters): Promise<Obtainable[] | undefined> => withContext(identifiers)(
  async (context) => (
    context ? ObtainableService.reset({
      isCollectible,
      context,
    }) : undefined
  ),
);

export const resetPoints = (
  parameters: Omit<ResetObtainablesParameters, 'isCollectible'>
) => resetObtainables(parameters);

export const resetCollectibles = (
  parameters: Omit<ResetObtainablesParameters, 'isCollectible'>
) => resetObtainables({ ...parameters, isCollectible: true });
