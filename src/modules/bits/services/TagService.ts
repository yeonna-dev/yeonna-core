import { DB, TimestampedRecord } from '../../../common/DB';
import { nanoid } from '../../../common/nanoid';

export enum TagField
{
  id = 'id',
  name = 'name',
};

export interface TagRecord extends TimestampedRecord
{
  [TagField.id]: string;
  [TagField.name]: string;
}

export interface Tag
{
  id: string;
  name: string;
}

export class TagService
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
      query.whereIn(TagField.id, idsArray);
    }

    if(search)
      query.and.where(TagField.name, 'LIKE', `%${search}%`);

    if(names)
      query.and.whereIn(TagField.name, names);

    const data = await query;
    return data.map(TagService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async create(names: string | string[])
  {
    names = Array.isArray(names) ? names : [names];
    if(!names || names.length === 0)
      throw new Error('No name/s provided');

    const tagsData = names.map(name => ({
      [TagField.id]: nanoid(15),
      [TagField.name]: name,
    }));

    const data = await DB.tags()
      .insert(tagsData)
      .returning('*');

    return data.map(TagService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async remove(names: string | string[])
  {
    names = Array.isArray(names) ? names : [names];
    if(!names || names.length === 0)
      throw new Error('No name/s provided');

    const data = await DB.tags()
      .delete()
      .whereIn(TagField.name, names)
      .returning('*');

    return data.map(TagService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static serialize(tagRecord: TagRecord): Tag
  {
    return {
      id: tagRecord[TagField.id],
      name: tagRecord[TagField.name],
    };
  }
};
