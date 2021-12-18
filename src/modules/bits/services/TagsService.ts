import { DB } from '../../../common/DB';
import { nanoid } from '../../../common/nanoid';

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
  }: {
    ids?: string | string[],
    search?: string,
    names?: string[],
  })
  {
    const query = DB.tags();
    if(ids)
    {
      const idsArray = Array.isArray(ids) ? ids : [ids];
      query.whereIn(TagsFields.id, idsArray);
    }

    if(search)
      query.and.where(TagsFields.name, 'LIKE', `%${search}%`);

    if(names)
      query.and.whereIn(TagsFields.name, names);

    const data = await query;
    return this.serialize(data);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async create(names: string | string[])
  {
    names = Array.isArray(names) ? names : [names];
    if(!names || names.length === 0)
      throw new Error('No name/s provided');

    const tagsData = names.map(name => ({
      [TagsFields.id]: nanoid(15),
      [TagsFields.name]: name,
    }));

    const data = await DB.tags()
      .insert(tagsData)
      .returning('*');

    return this.serialize(data);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async remove(names: string | string[])
  {
    names = Array.isArray(names) ? names : [names];
    if(!names || names.length === 0)
      throw new Error('No name/s provided');

    const data = await DB.tags()
      .delete()
      .whereIn(TagsFields.name, names)
      .returning('*');

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
};
