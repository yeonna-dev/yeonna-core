import { DB, TimestampedRecord } from '../../../common/DB';
import { BitsFields, BitsService } from './BitsService';

export enum UsersBitsFields
{
  user_id = 'user_id',
  bit_id = 'bit_id',
  tag_ids = 'tag_ids',
};

export interface UserBitRecord extends TimestampedRecord
{
  user_id: string;
  bit_id: string;
  tag_ids?: string;
  content?: string;
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

export class UsersBitsService
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
      .join(BitsService.table, UsersBitsFields.bit_id, BitsFields.id);

    if(userIds)
      query.whereIn(UsersBitsFields.user_id, userIds);

    if(bitIds)
      query.and.whereIn(UsersBitsFields.bit_id, bitIds);

    if(search)
      query.and.where(`${BitsService.table}.${BitsFields.content}`, 'LIKE', `%${search}%`);

    const data = await query;
    if(!data || data.length === 0)
      return [];

    return data.map(UsersBitsService.serialize);
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
        [UsersBitsFields.user_id]: userId,
        [UsersBitsFields.bit_id]: bitId,
      };

      if(tagIds && tagIds.length !== 0)
        data[UsersBitsFields.tag_ids] = tagIds.join(',');

      insertData.push(data);
    }

    const data = await DB.usersBits()
      .insert(insertData)
      .returning('*');

    return data.map(UsersBitsService.serialize);
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
      .where({ [UsersBitsFields.user_id]: userId, [UsersBitsFields.bit_id]: bitId })
      .returning('*');

    return data.map(deletedUserBit => ({
      userId: deletedUserBit[UsersBitsFields.user_id],
      bitId: deletedUserBit[UsersBitsFields.bit_id],
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
      .update({ [UsersBitsFields.tag_ids]: tagIds.join(',') })
      .where({
        [UsersBitsFields.user_id]: userId,
        [UsersBitsFields.bit_id]: bitId,
      })
      .returning('*');

    return data.map(UsersBitsService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static serialize(userBitRecord: UserBitRecord): UserBit
  {
    const serialized: UserBit =
    {
      user: { id: userBitRecord[UsersBitsFields.user_id] },
      bit: { id: userBitRecord[UsersBitsFields.bit_id] },
    };

    /* Set the `bit` property of the object if the `content` field has a value. */
    const content = userBitRecord[BitsFields.content];
    if(content)
      serialized.bit.content = content;

    /* Set the `tags` property of the object if the `tag_ids` field has a value. */
    const tagIds = userBitRecord[UsersBitsFields.tag_ids];
    if(tagIds)
      serialized.tags = tagIds.split(',').map(id => ({ id }));

    return serialized;
  }
};
