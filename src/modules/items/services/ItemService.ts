import { DB, TimestampedRecord } from '../../../common/DB';

export enum ItemField
{
  code = 'code',
  name = 'name',
  chance_min = 'chance_min',
  chance_max = 'chance_max',
  price = 'price',
  image = 'image',
  emote = 'emote',
  context = 'context',
  category_id = 'category_id',
};

export interface ItemRecord extends TimestampedRecord
{
  [ItemField.code]: string;
  [ItemField.name]: string;
  [ItemField.chance_min]?: number;
  [ItemField.chance_max]?: number;
  [ItemField.price]?: number;
  [ItemField.image]?: string;
  [ItemField.emote]?: string;
  [ItemField.category_id]?: string;
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

export class ItemService
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
      query.where(ItemField.code, code);

    if(chance)
      query
        .and.where(ItemField.chance_min, '<', chance)
        .and.where(ItemField.chance_max, '>', chance);

    const data = await query;
    return data.map(ItemService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async findRandom(chance: number, context?: string)
  {
    const query = DB.items()
      .and.where(ItemField.chance_min, '<', chance)
      .and.where(ItemField.chance_max, '>', chance);

    if(context)
      query.and.where(ItemField.context, context);

    const [data] = await query
      .orderByRaw('RANDOM()')
      .limit(1);

    if(!data)
      return;

    return ItemService.serialize(data);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async findByCodes(codes: string[])
  {
    const data = await DB.items()
      .whereIn(ItemField.code, codes);

    return data.map(ItemService.serialize);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static serialize(item: ItemRecord): Item
  {
    return {
      code: item[ItemField.code],
      name: item[ItemField.name],
      chanceMin: item[ItemField.chance_min],
      chanceMax: item[ItemField.chance_max],
      price: item[ItemField.price],
      image: item[ItemField.image],
      emote: item[ItemField.emote],
      categoryId: item[ItemField.category_id],
    };
  }
};
