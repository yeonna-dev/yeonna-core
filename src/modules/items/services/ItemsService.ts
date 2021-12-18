import { DB } from '../../../common/DB';

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
  created_at = 'created_at',
  updated_at = 'updated_at',
  deleted_at = 'deleted_at',
};

export const ItemsService = new class
{
  /* Table name is added here to be able to use in joins in other services. */
  table = 'items';

  async find({
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
    return this.serialize(data);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async findRandom({
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

    const data = await query
      .orderByRaw('RANDOM()')
      .limit(1);
    return this.serialize(data).pop();
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async findByCodes(codes: string[])
  {
    const data = await DB.items()
      .whereIn(ItemsFields.code, codes);

    return this.serialize(data);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  serialize(items: ItemRecord[])
  {
    if(!items) return [];
    return items.map(({ category_id, code, name, chance_min, chance_max, price, image, emote }) =>
    ({
      categoryID: category_id,
      code,
      name,
      chanceMin: chance_min,
      chanceMax: chance_max,
      price,
      image,
      emote,
    }));
  }
};
