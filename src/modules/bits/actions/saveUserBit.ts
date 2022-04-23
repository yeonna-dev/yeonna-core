import { createTags } from '.';
import { NoBitContentProvided } from '../../../common/errors';
import { findOrCreateUser } from '../../users/actions';
import { BitsService } from '../services/BitsService';
import { UsersBitsService } from '../services/UsersBitsService';

export async function saveUserBit({
  userIdentifier,
  content,
  tags,
  discordGuildId,
}: {
  userIdentifier: string,
  content: string,
  tags?: string[],
  discordGuildId?: string,
})
{
  if(!content)
    throw new NoBitContentProvided();

  /* Check if a bit with the same content is existing. */
  const [foundBit] = await BitsService.find({ content });

  /* Create the bit if not existing. */
  let bitId;
  if(foundBit)
    bitId = foundBit.id;
  else
  {
    const [createdBit] = await BitsService.create([content]);
    bitId = createdBit.id;
  }

  /* Get the user by the given user identifier. */
  const userId = await findOrCreateUser({ userIdentifier, discordGuildId });

  /* Check if the bit has been added to the user. */
  const [userBit] = await UsersBitsService.find({
    userIds: [userId],
    bitIds: [bitId],
  });

  /* Find the tags by the given tag names. */
  let tagIds: string[] = [];
  if(tags)
  {
    const createdTags = await createTags(tags);
    tagIds = createdTags.map(({ id }) => id);
  }

  /* If the user already has the bit, do not save it. */
  if(userBit)
    return userBit;

  const [createdUserBit] = await UsersBitsService.create([{ userId, bitId, tagIds }]);
  return createdUserBit;
}
