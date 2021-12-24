import { DB, TimestampedRecord } from '../../../common/DB';
import { nanoid } from '../../../common/nanoid';

export enum TagsFields
{
  id = 'id',
  name = 'name',
};

export interface TagRecord extends TimestampedRecord
{
  id: string;
  name: string;
}

export interface Tag
{
  id: string;
  name: string;
}

export class TagsService
{
  static tableName = 'tags';

  static async find({
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
    return data.map(TagsService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async create(names: string | string[])
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

    return data.map(TagsService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async remove(names: string | string[])
  {
    names = Array.isArray(names) ? names : [names];
    if(!names || names.length === 0)
      throw new Error('No name/s provided');

    const data = await DB.tags()
      .delete()
      .whereIn(TagsFields.name, names)
      .returning('*');

    return data.map(TagsService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static serialize(tagRecord: TagRecord): Tag
  {
    return {
      id: tagRecord[TagsFields.id],
      name: tagRecord[TagsFields.name],
    };
  }
};
