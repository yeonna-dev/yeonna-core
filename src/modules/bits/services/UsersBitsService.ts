import { supabase } from '../../../common/supabase-client';
import { BitsFields, BitsService } from './BitsService';

const usersBits = () => supabase.from<UserBitRecord>('users_bits');
export enum UsersBitsFields
{
  user_id = 'user_id',
  bit_id = 'bit_id',
  bit = 'bit',
};

export const UsersBitsService = new class
{
  async find({
    userIDs,
    bitIDs,
    search,
  } : {
    userIDs?: string[],
    bitIDs?: string[],
    search?: string,
  })
  {
    const query = usersBits()
      .select(`
        ${UsersBitsFields.user_id},
        ${UsersBitsFields.bit_id},
        ${UsersBitsFields.bit}:${BitsService.tableName} (
          ${BitsFields.content}
        )
      `);

    if(userIDs)
      query.in(UsersBitsFields.user_id, userIDs);

    if(bitIDs)
      query.in(UsersBitsFields.bit_id, bitIDs);

    if(search)
      query.like(`${UsersBitsFields.bit}.${BitsFields.content}`, `%${search}%`);

    let { data, error } = await query;
    if(error)
      throw error;

    if(! data || data.length === 0)
      return [];

    /* Remove duplicate data from result and filter results
      that only have bits if a search query was given. */
    const filtered: UserBitRecord[] = [];
    for(const userBit of data)
    {
      const isUnique = ! filtered.some(element =>
        element[UsersBitsFields.bit_id] === userBit[UsersBitsFields.bit_id]
      );

      if(! isUnique)
        continue;

      if(search && ! userBit[UsersBitsFields.bit])
        continue;

      filtered.push(userBit);
    }

    return this.serialize(filtered);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async create(usersBitsData: { userID: string, bitID: string }[])
  {
    const insertData = usersBitsData.map(({ userID, bitID }) => ({
      [UsersBitsFields.user_id]: userID,
      [UsersBitsFields.bit_id]: bitID,
    }));

    const { data, error } = await usersBits().insert(insertData);
    if(error)
      throw error;

    return this.serialize(data);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async remove({ userID, bitID }: { userID: string, bitID: string })
  {
    const { data, error } = await usersBits()
      .delete({ returning: 'representation' })
      .match({ [UsersBitsFields.user_id]: userID, [UsersBitsFields.bit_id]: bitID });

    if(error)
      throw error;

    return this.serialize(data);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  serialize(usersBits: UserBitRecord[] | null)
  {
    const data = [];
    for(const userBit of (usersBits || []))
    {
      const serialized: any =
      {
        user: { id: userBit[UsersBitsFields.user_id] },
        bit: { id: userBit[UsersBitsFields.bit_id] },
      };

      const bit = userBit[UsersBitsFields.bit];
      if(bit)
        serialized.bit.content = bit[BitsFields.content];

      data.push(serialized);
    }

    return data;
  }
}
