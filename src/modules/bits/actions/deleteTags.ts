import { TagsService } from '../services/TagsService';

export async function deleteTags(names: string[])
{
  return TagsService.remove(names);
}
