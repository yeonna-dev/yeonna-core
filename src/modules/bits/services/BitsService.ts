import { DB } from '../../../common/DB';
import { nanoid } from '../../../common/nanoid';

export enum BitsFields
{
  id = 'id',
  content = 'content',
};

export const BitsService = new class
{
  /* Table name is added here to be able to use in joins in other services. */
  table = 'bits';

  async find({
    ids,
    search,
    content,
  }: {
    ids?: string | string[],
    search?: string,
    content?: string,
  })
  {
    const query = DB.bits();
    if(ids)
    {
      const idsArray = Array.isArray(ids) ? ids : [ids];
      query.whereIn(BitsFields.id, idsArray);
    }

    if(search)
      query.and.where(BitsFields.content, 'LIKE', `%${search}%`);

    if(content)
      query.and.where(BitsFields.content, content);

    const data = await query;
    return data || [];
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async create(content: string | string[])
  {
    content = Array.isArray(content) ? content : [content];

    if(!content || content.length === 0)
      throw new Error('No content provided');

    const bitsData = content.map(content => ({
      [BitsFields.id]: nanoid(15),
      [BitsFields.content]: content,
    }));

    const data = await DB.bits()
      .insert(bitsData)
      .returning('*');

    return data ? data.map(bit => bit[BitsFields.id]) : [];
  }
};
