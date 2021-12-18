import { BitNotFound, UserBitNotFound } from '../../../common/errors';
import { findUser } from '../../users/actions';
import { BitsService } from '../services/BitsService';
import { UsersBitsService } from '../services/UsersBitsService';

export async function removeUserBits({ userIdentifier, bitID }: {
  userIdentifier: string,
  bitID: string,
})
{
  /* Check if bit is existing. */
  const [foundBit] = await BitsService.find({ ids: [bitID] });
  bitID = foundBit.id;

  if(!foundBit)
    throw new BitNotFound();

  /* Get the user by the given identifier. */
  const userID = await findUser(userIdentifier);

  /* Check if the bit has been added to the user. */
  const [userBit] = await UsersBitsService.find({ userIDs: [userID], bitIDs: [bitID] });
  if(!userBit)
    throw new UserBitNotFound();

  return UsersBitsService.remove({ userID, bitID });
}
