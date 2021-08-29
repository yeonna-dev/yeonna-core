import { BitsService } from '../services/BitsService';
import { UsersBitsService } from '../services/UsersBitsService';

import { findUser } from '../../users/actions';

import { NoBitContentProvided } from '../../../common/errors';

export async function saveUserBit({
  userIdentifier,
  content,
} : {
  userIdentifier: string,
  content: string,
})
{
  if(! content)
    throw new NoBitContentProvided();

  /* Check if a bit with the same content is existing. */
  const [ foundBit ] = await BitsService.find({ content });

  /* Create the bit if not existing. */
  let bitID;
  if(foundBit)
    bitID = foundBit.id;
  else
  {
    const [ createdBit ] = await BitsService.create([ content ]);
    bitID = createdBit;
  }

  /* Get the user by the given user identifier. */
  const userID = await findUser(userIdentifier);

  /* Check if the bit has been added to the user. */
  const [ userBit ] = await UsersBitsService.find({ userIDs: [ userID ], bitIDs: [ bitID ] });

  /* Save the bit for the user if the user does not have the bit. */
  if(userBit)
    return;

  const [ createdUserBit ] = await UsersBitsService.create([ { userID, bitID } ]);
  return createdUserBit;
}
