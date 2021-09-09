import { supabase } from '../../../common/supabase-client';
import { nanoid } from '../../../common/nanoid';

const bits = () => supabase.from<BitRecord>('bits');
export enum BitsFields
{
  id = 'id',
  content = 'content',
};

export const BitsService = new class
{
  tableName = 'bits';

  async find({
    ids,
    search,
    content,
  } : {
    ids?: string | string[],
    search?: string,
    content?: string,
  })
  {
    const idsArray = Array.isArray(ids) ? ids : [ ids ];

    const query = bits()
      .select();

    if(ids)
      query.in(BitsFields.id, idsArray);

    if(search)
      query.like(BitsFields.content, `%${search}%`);

    // TODO: Remove unnecessary searching by exact content.
    if(content)
      query.eq(BitsFields.content, content);

    const { data, error } = await query;
    if(error)
      throw error;

    return data || [];
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async create(content: string | string[])
  {
    content = Array.isArray(content) ? content : [ content ];

    if(! content || content.length === 0)
      throw new Error('No content provided');

    const bitsData = content.map(content => ({
      [BitsFields.id]: nanoid(15),
      [BitsFields.content]: content,
    }));

    const { data, error } = await bits().insert(bitsData);
    if(error)
      throw error;

    return data ? data.map(bit => bit[BitsFields.id]) : [];
  }
}
