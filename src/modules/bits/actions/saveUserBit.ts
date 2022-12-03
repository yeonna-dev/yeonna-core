import { createTags } from '.';
import { NoBitContentProvided } from '../../../common/errors';
import { withUserAndContext } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { BitService } from '../services/BitService';
import { UserBitService } from '../services/UserBitService';

type SaveUserBitParameters = Identifiers &
{
  content: string;
  tags?: string[];
};

export const saveUserBit = async ({
  content,
  tags,
  ...identifiers
}: SaveUserBitParameters) => withUserAndContext(identifiers)(
  async (userId) =>
  {
    if(!content)
      throw new NoBitContentProvided();

    /* Check if a bit with the same content is existing. */
    const [foundBit] = await BitService.find({ content });

    /* Create the bit if not existing. */
    let bitId;
    if(foundBit)
      bitId = foundBit.id;
    else
    {
      const [createdBit] = await BitService.create([content]);
      bitId = createdBit.id;
    }

    /* Check if the bit has been added to the user. */
    const [userBit] = await UserBitService.find({
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

    const [createdUserBit] = await UserBitService.create([{ userId, bitId, tagIds }]);
    return createdUserBit;
  },
  {
    createNonexistentUser: true,
  }
);
