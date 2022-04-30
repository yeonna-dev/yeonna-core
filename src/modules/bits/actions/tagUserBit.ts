import { BitNotFound, TagsNotFound } from '../../..';
import { BitsService } from '../services/BitsService';
import { TagsService } from '../services/TagsService';
import { UsersBitsService } from '../services/UsersBitsService';

export async function tagUserBit({
  userIdentifier,
  bitContent,
  tags,
}: {
  userIdentifier: string,
  bitContent: string,
  tags: string[],
})
{
  /* Get the bit with the given content. */
  const bit = await BitsService.find({ content: bitContent });
  if(bit.length === 0)
    throw new BitNotFound();

  /* Get the tags with the given names. */
  const foundTags = await TagsService.find({ names: tags });
  if(!foundTags || foundTags.length === 0)
    throw new TagsNotFound();

  /* Update the user's bit with the new tags. */
  // const updated = await UsersBitsService.addTags({  });
}
