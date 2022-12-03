import { DB, TimestampedRecord } from '../../../common/DB';
import { BitField, BitService } from './BitService';

export enum UserBitField
{
  user_id = 'user_id',
  bit_id = 'bit_id',
  tag_ids = 'tag_ids',
};

export interface UserBitRecord extends TimestampedRecord
{
  [UserBitField.user_id]: string;
  [UserBitField.bit_id]: string;
  [UserBitField.tag_ids]?: string;
  [BitField.content]?: string;
}

export interface UserBit
{
  user: {
    id: string;
  };
  bit: {
    id: string;
    content?: string;
  };
  tags?: {
    id: string;
    name?: string;
  }[];
}

export interface DeletedUserBit
{
  userId: string;
  bitId: string;
}

export class UserBitService
{
  static async find({
    userIds,
    bitIds,
    search,
  }: {
    userIds?: string[],
    bitIds?: string[],
    search?: string,
  })
  {
    const query = DB.usersBits()
      .join(BitService.table, UserBitField.bit_id, BitField.id);

    if(userIds)
      query.whereIn(UserBitField.user_id, userIds);

    if(bitIds)
      query.and.whereIn(UserBitField.bit_id, bitIds);

    if(search)
      query.and.where(`${BitService.table}.${BitField.content}`, 'LIKE', `%${search}%`);

    const data = await query;
    if(!data || data.length === 0)
      return [];

    return data.map(UserBitService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async create(usersBitsData: {
    userId: string,
    bitId: string,
    tagIds: string[],
  }[])
  {
    const insertData = [];
    for(const { userId, bitId, tagIds } of usersBitsData)
    {
      const data: UserBitRecord =
      {
        [UserBitField.user_id]: userId,
        [UserBitField.bit_id]: bitId,
      };

      if(tagIds && tagIds.length !== 0)
        data[UserBitField.tag_ids] = tagIds.join(',');

      insertData.push(data);
    }

    const data = await DB.usersBits()
      .insert(insertData)
      .returning('*');

    return data.map(UserBitService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async remove({
    userId,
    bitId,
  }: {
    userId: string,
    bitId: string,
  }): Promise<DeletedUserBit[]>
  {
    const data = await DB.usersBits()
      .delete()
      .where({ [UserBitField.user_id]: userId, [UserBitField.bit_id]: bitId })
      .returning('*');

    return data.map(deletedUserBit => ({
      userId: deletedUserBit[UserBitField.user_id],
      bitId: deletedUserBit[UserBitField.bit_id],
    }));
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async addTags({
    userId,
    bitId,
    tagIds,
  }: {
    userId: string,
    bitId: string,
    tagIds: string[],
  })
  {
    const data = await DB.usersBits()
      .update({ [UserBitField.tag_ids]: tagIds.join(',') })
      .where({
        [UserBitField.user_id]: userId,
        [UserBitField.bit_id]: bitId,
      })
      .returning('*');

    return data.map(UserBitService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static serialize(userBitRecord: UserBitRecord): UserBit
  {
    const serialized: UserBit =
    {
      user: { id: userBitRecord[UserBitField.user_id] },
      bit: { id: userBitRecord[UserBitField.bit_id] },
    };

    /* Set the `bit` property of the object if the `content` field has a value. */
    const content = userBitRecord[BitField.content];
    if(content)
      serialized.bit.content = content;

    /* Set the `tags` property of the object if the `tag_ids` field has a value. */
    const tagIds = userBitRecord[UserBitField.tag_ids];
    if(tagIds)
      serialized.tags = tagIds.split(',').map(id => ({ id }));

    return serialized;
  }
};
