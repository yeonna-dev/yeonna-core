import { Tag, TagService } from '../services/TagService';

export async function createTags(names: string[])
{
  /*
    Only create new tags for the given names that are not names of existing tags.
    After tags have been created, return the merged IDs of the existing and created tags.
  */
  const found = await TagService.find({ names });
  const foundNames = found.map(({ name }) => name);
  const newTags = names.filter(name => !foundNames.includes(name));
  let createdTags: Tag[] = [];
  if(newTags.length !== 0)
    createdTags = await TagService.create(newTags);

  return createdTags.concat(found);
}
