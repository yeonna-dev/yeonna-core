import { BitsService } from '../services/BitsService';
import { UsersBitsService } from '../services/UsersBitsService';

import { findOrCreateUser } from '../../users/actions';
import { createTags } from '.';

import { NoBitContentProvided } from '../../../common/errors';

export async function saveUserBit({
  userIdentifier,
  content,
  tags,
  discordGuildID,
} : {
  userIdentifier: string,
  content: string,
  tags?: string[],
  discordGuildID?: string,
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
  const userID = await findOrCreateUser({ userIdentifier, discordGuildID });

  /* Check if the bit has been added to the user. */
  const [ userBit ] = await UsersBitsService.find({
    userIDs: [ userID ],
    bitIDs: [ bitID ],
  });

  /* If the user already has the bit, do not save it. */
  if(userBit)
    return;

  /* Find the tags by the given tag names. */
  let tagIDs: string[] = [];
  if(tags)
  {
    const createdTags = await createTags(tags);
    tagIDs = createdTags.map(({ id }) => id);
  }

  const [ createdUserBit ] = await UsersBitsService.create([ { userID, bitID, tagIDs } ]);
  return createdUserBit;
}
