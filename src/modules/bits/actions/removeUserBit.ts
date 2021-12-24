import { BitNotFound, UserBitNotFound } from '../../../common/errors';
import { findUser } from '../../users/actions';
import { BitsService } from '../services/BitsService';
import { UsersBitsService } from '../services/UsersBitsService';

export async function removeUserBits({ userIdentifier, bitId }: {
  userIdentifier: string,
  bitId: string,
})
{
  /* Check if bit is existing. */
  const [foundBit] = await BitsService.find({ ids: [bitId] });
  bitId = foundBit.id;

  if(!foundBit)
    throw new BitNotFound();

  /* Get the user by the given identifier. */
  const userId = await findUser(userIdentifier);

  /* Check if the bit has been added to the user. */
  const [userBit] = await UsersBitsService.find({ userIds: [userId], bitIds: [bitId] });
  if(!userBit)
    throw new UserBitNotFound();

  return UsersBitsService.remove({ userId, bitId });
}
