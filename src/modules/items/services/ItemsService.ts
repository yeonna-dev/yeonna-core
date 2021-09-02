import { supabase } from '../../../common/supabase-client';

const items = () => supabase.from<ItemRecord>('items');
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
  async find({
    code,
    chance,
  } : {
    code?: string,
    chance?: number,
  })
  {
    const query = items()
      .select();

    if(code)
      query.eq(ItemsFields.code, code);

    if(chance)
      query
        .lte(ItemsFields.chance_min, chance)
        .gte(ItemsFields.chance_max, chance);

    const { data, error } = await query;
    if(error)
      throw error;

    // TODO: Flip condition
    return ! data || data.length === 0 ? [] : this.serialize(data);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async findByCodes(codes: string[])
  {
    const { data, error } = await items()
      .select()
      .in(ItemsFields.code, codes);

    if(error)
      throw error;

    // TODO: Flip condition
    return ! data || data.length === 0 ? [] : this.serialize(data);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  serialize(items: ItemRecord[])
  {
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
}
