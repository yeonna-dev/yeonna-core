import { DB, TimestampedRecord } from '../../../common/DB';

export enum ItemsFields
{
  category_id = 'category_id',
  code = 'code',
  name = 'name',
  chance_min = 'chance_min',
  chance_max = 'chance_max',
  price = 'price',
  image = 'image',
  emote = 'emote',
};

export interface ItemRecord extends TimestampedRecord
{
  category_id?: string;
  code: string;
  name: string;
  chance_min?: number;
  chance_max?: number;
  price?: number;
  image?: string;
  emote?: string;
}

export interface Item
{
  code: string;
  name: string;
  chanceMin?: number;
  chanceMax?: number;
  price?: number;
  image?: string;
  emote?: string;
  categoryId?: string;
}

export class ItemsService
{
  /* Table name is added here to be able to use in joins in other services. */
  static table = 'items';

  static async find({
    code,
    chance,
  }: {
    code?: string,
    chance?: number,
  })
  {
    const query = DB.items();
    if(code)
      query.where(ItemsFields.code, code);

    if(chance)
      query
        .and.where(ItemsFields.chance_min, '<', chance)
        .and.where(ItemsFields.chance_max, '>', chance);

    const data = await query;
    return data.map(ItemsService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async findRandom({
    code,
    chance,
  }: {
    code?: string,
    chance?: number,
  })
  {
    const query = DB.items();
    if(code)
      query.where(ItemsFields.code, code);

    if(chance)
      query
        .and.where(ItemsFields.chance_min, '<', chance)
        .and.where(ItemsFields.chance_max, '>', chance);

    const [data] = await query
      .orderByRaw('RANDOM()')
      .limit(1);

    if(!data)
      return;

    return ItemsService.serialize(data);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async findByCodes(codes: string[])
  {
    const data = await DB.items()
      .whereIn(ItemsFields.code, codes);

    return data.map(ItemsService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static serialize(item: ItemRecord): Item
  {
    return {
      code: item[ItemsFields.code],
      name: item[ItemsFields.name],
      chanceMin: item[ItemsFields.chance_min],
      chanceMax: item[ItemsFields.chance_max],
      price: item[ItemsFields.price],
      image: item[ItemsFields.image],
      emote: item[ItemsFields.emote],
      categoryId: item[ItemsFields.category_id],
    };
  }
};
