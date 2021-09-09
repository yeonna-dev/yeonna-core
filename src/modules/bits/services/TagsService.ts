import { supabase } from '../../../common/supabase-client';
import { nanoid } from '../../../common/nanoid';

const tags = () => supabase.from<TagRecord>('tags');
export enum TagsFields
{
  id = 'id',
  name = 'name',
};

export const TagsService = new class
{
  tableName = 'tags';

  async find({
    ids,
    search,
    names,
  } : {
    ids?: string | string[],
    search?: string,
    names?: string[],
  })
  {
    const idsArray = Array.isArray(ids) ? ids : [ ids ];

    const query = tags()
      .select();

    if(ids)
      query.in(TagsFields.id, idsArray);

    if(search)
      query.like(TagsFields.name, `%${search}%`);

    if(names)
      query.in(TagsFields.name, names);

    const { data, error } = await query;
    if(error)
      throw error;

    return this.serialize(data);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async create(names: string | string[])
  {
    names = Array.isArray(names) ? names : [ names ];
    if(! names || names.length === 0)
      throw new Error('No name/s provided');

    const tagsData = names.map(name => ({
      [TagsFields.id]: nanoid(15),
      [TagsFields.name]: name,
    }));

    const { data, error } = await tags().insert(tagsData);
    if(error)
      throw error;

    return this.serialize(data);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async remove(names: string | string[])
  {
    names = Array.isArray(names) ? names : [ names ];
    if(! names || names.length === 0)
      throw new Error('No name/s provided');

    const { data, error } = await tags()
      .delete({ returning: 'representation' })
      .in(TagsFields.name, names);

    if(error)
      throw error;

    return this.serialize(data);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  serialize(tags: TagRecord[] | null)
  {
    return (tags || []).map(tag => ({
      id: tag[TagsFields.id],
      name: tag[TagsFields.name],
    }));
  }
}
