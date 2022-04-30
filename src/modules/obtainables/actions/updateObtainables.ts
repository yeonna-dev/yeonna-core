import { withUserAndContext } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { ObtainableService } from '../services/ObtainableService';

type UpdateObtainablesParameters = Identifiers &
{
  amount: number;
  isCollectible?: boolean;
  add?: boolean;
  subtract?: boolean;
};

export const updateObtainables = ({
  amount,
  isCollectible,
  add,
  subtract,
  ...identifiers
}: UpdateObtainablesParameters) => withUserAndContext(identifiers)(
  async (userId, context) =>
  {
    amount = Math.abs(amount);

    const obtainables = await ObtainableService.find({
      userId,
      isCollectible,
      context,
    });

    /* Create the obtainable record if not existing. */
    if(obtainables === undefined)
      await ObtainableService.create({
        userId,
        amount,
        isCollectible,
        context,
      });
    else
    {
      let newPoints = amount;
      if(add)
        newPoints = obtainables + amount;
      if(subtract)
        newPoints = obtainables - amount;

      return ObtainableService.update({
        userId,
        amount: newPoints,
        isCollectible,
        context,
      });
    }
  },
  {
    createNonexistentUser: true,
    requireContextParameters: true,
  }
);

export const updatePoints = (
  parameters: Omit<UpdateObtainablesParameters, 'isCollectible'>
) => updateObtainables(parameters);

export const updateCollectibles = (
  parameters: Omit<UpdateObtainablesParameters, 'isCollectible'>
) => updateObtainables({ ...parameters, isCollectible: true });
