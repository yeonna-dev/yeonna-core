import { DB, TimestampedRecord } from '../../../common/DB';
import { nanoid } from '../../../common/nanoid';

export enum BitField
{
  id = 'id',
  content = 'content',
};

export interface BitRecord extends TimestampedRecord
{
  [BitField.id]: string;
  [BitField.content]: string;
}

export interface Bit
{
  id: string;
  content: string;
}

export class BitService
{
  /* Table name is added here to be able to use in joins in other services. */
  static table = 'bits';

  static async find({
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
      query.whereIn(BitField.id, idsArray);
    }

    if(search)
      query.and.where(BitField.content, 'LIKE', `%${search}%`);

    if(content)
      query.and.where(BitField.content, content);

    const data = await query;
    return data.map(BitService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async create(content: string | string[])
  {
    content = Array.isArray(content) ? content : [content];

    if(!content || content.length === 0)
      throw new Error('No content provided');

    const bitsData = content.map(content => ({
      [BitField.id]: nanoid(15),
      [BitField.content]: content,
    }));

    const data = await DB.bits()
      .insert(bitsData)
      .returning('*');

    return data.map(BitService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static serialize(bitRecord: BitRecord): Bit
  {
    return {
      id: bitRecord[BitField.id],
      content: bitRecord[BitField.content],
    };
  }
};
