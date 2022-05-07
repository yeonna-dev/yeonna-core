import { BitNotFound, UserBitNotFound } from '../../../common/errors';
import { withUser } from '../../../common/providers';
import { BitsService } from '../services/BitsService';
import { UsersBitsService } from '../services/UsersBitsService';

export const removeUserBits = async ({
  userIdentifier,
  bitId,
}: {
  userIdentifier: string,
  bitId: string,
}) => withUser({ userIdentifier })(
  async (userId) =>
  {
    /* Check if bit is existing. */
    const [foundBit] = await BitsService.find({ ids: [bitId] });
    bitId = foundBit.id;

    if(!foundBit)
      throw new BitNotFound();

    /* Check if the bit has been added to the user. */
    const [userBit] = await UsersBitsService.find({ userIds: [userId], bitIds: [bitId] });
    if(!userBit)
      throw new UserBitNotFound();

    return UsersBitsService.remove({ userId, bitId });
  },
  {}
);
