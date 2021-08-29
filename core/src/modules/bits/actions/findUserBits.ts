import { findUser } from '../../users/actions';
import { UsersBitsService } from '../services/UsersBitsService';

export async function findUserBits({
  userIdentifier,
  search,
} : {
  userIdentifier: string,
  search?: string,
})
{
  /* Get user with the given user identifier. */
  const userID = await findUser(userIdentifier);

  /* Get the user's bits and do a search by the search query if given.  */
  return UsersBitsService.find({ userIDs: [ userID ], search });
}
