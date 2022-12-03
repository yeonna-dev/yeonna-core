import { BitNotFound, TagsNotFound } from '../../..';
import { BitService } from '../services/BitService';
import { TagService } from '../services/TagService';

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
  const bit = await BitService.find({ content: bitContent });
  if(bit.length === 0)
    throw new BitNotFound();

  /* Get the tags with the given names. */
  const foundTags = await TagService.find({ names: tags });
  if(!foundTags || foundTags.length === 0)
    throw new TagsNotFound();

  /* Update the user's bit with the new tags. */
  // const updated = await UsersBitsService.addTags({  });
}
