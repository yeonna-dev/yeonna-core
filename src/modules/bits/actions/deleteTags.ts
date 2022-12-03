import { TagService } from '../services/TagService';

export async function deleteTags(names: string[])
{
  return TagService.remove(names);
}
