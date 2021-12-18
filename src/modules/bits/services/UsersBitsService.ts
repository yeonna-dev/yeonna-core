import { DB } from '../../../common/DB';
import { BitsFields, BitsService } from './BitsService';

export enum UsersBitsFields
{
  user_id = 'user_id',
  bit_id = 'bit_id',
  tag_ids = 'tag_ids',
};

export const UsersBitsService = new class
{
  async find({
    userIDs,
    bitIDs,
    search,
  }: {
    userIDs?: string[],
    bitIDs?: string[],
    search?: string,
  })
  {
    const query = DB.usersBits()
      .join(BitsService.table, UsersBitsFields.bit_id, BitsFields.id);

    if(userIDs)
      query.whereIn(UsersBitsFields.user_id, userIDs);

    if(bitIDs)
      query.and.whereIn(UsersBitsFields.bit_id, bitIDs);

    if(search)
      query.and.where(`${BitsService.table}.${BitsFields.content}`, 'LIKE', `%${search}%`);

    const data = await query;
    if(!data || data.length === 0)
      return [];

    return this.serialize(data);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async create(usersBitsData: { userID: string, bitID: string, tagIDs: string[]; }[])
  {
    const insertData = usersBitsData.map(({ userID, bitID, tagIDs }) =>
    {
      const data: any =
      {
        [UsersBitsFields.user_id]: userID,
        [UsersBitsFields.bit_id]: bitID,
      };

      if(tagIDs && tagIDs.length !== 0)
        data[UsersBitsFields.tag_ids] = tagIDs.join(',');

      return data;
    });

    const data = await DB.usersBits()
      .insert(insertData)
      .returning('*');

    return this.serialize(data);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async remove({ userID, bitID }: { userID: string, bitID: string; })
  {
    const data = await DB.usersBits()
      .delete()
      .where({ [UsersBitsFields.user_id]: userID, [UsersBitsFields.bit_id]: bitID })
      .returning('*');

    return data.map((deletedUserBit) => ({
      userID: deletedUserBit[UsersBitsFields.user_id],
      bitID: deletedUserBit[UsersBitsFields.bit_id],
    }));
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async addTags({ userID, bitID, tagIDs }: { userID: string, bitID: string, tagIDs: string[]; })
  {
    return DB.usersBits()
      .update({ [UsersBitsFields.tag_ids]: tagIDs.join(',') })
      .where({
        [UsersBitsFields.user_id]: userID,
        [UsersBitsFields.bit_id]: bitID,
      })
      .returning('*');
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  serialize(usersBits: any[] | null)
  {
    const data = [];
    for(const userBit of usersBits || [])
    {
      const serialized: any = { user: { id: userBit[UsersBitsFields.user_id] } };
      serialized.bit = { id: userBit[UsersBitsFields.bit_id] };

      const content = userBit[BitsFields.content];
      if(content)
        serialized.bit.content = content;

      data.push(serialized);
    }

    return data;
  }
};
