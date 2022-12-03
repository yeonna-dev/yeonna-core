import { BitNotFound, UserBitNotFound } from '../../../common/errors';
import { withUser } from '../../../common/providers';
import { BitService } from '../services/BitService';
import { UserBitService } from '../services/UserBitService';

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
    const [foundBit] = await BitService.find({ ids: [bitId] });
    bitId = foundBit.id;

    if(!foundBit)
      throw new BitNotFound();

    /* Check if the bit has been added to the user. */
    const [userBit] = await UserBitService.find({ userIds: [userId], bitIds: [bitId] });
    if(!userBit)
      throw new UserBitNotFound();

    return UserBitService.remove({ userId, bitId });
  },
  {}
);
