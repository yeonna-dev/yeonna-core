/** @param {import('knex').Knex} knex */
exports.up = async function(knex)
{
  /* Insert items. */
  const items =
  [
    { code: 'c', name: 'Candy', chance_min: 36, chance_max: 65, price: 10, emote: '🍬' },
    { code: 'j', name: 'Jelly', chance_min: 36, chance_max: 65, price: 10, emote: '🍓' },

    { code: 'a', name: 'Album', chance_min: 15, chance_max: 35, price: 100, emote: '💿' },
    { code: 'p', name: 'Plushie', chance_min: 15, chance_max: 35, price: 100, emote: '🧸' },

    { code: 'ph', name: 'Photo', chance_min: 6, chance_max: 14, price: 200, emote: '📷' },
    { code: 'ps', name: 'Poster', chance_min: 6, chance_max: 14, price: 200, emote: '🖼️' },

    { code: 'mc', name: 'MC Rail Cap', chance_min: 0.6, chance_max: 5, price: 750, image: 'https://i.imgur.com/papUxvz.png' },
    { code: 'jk', name: 'Jokbal', chance_min: 0.6, chance_max: 5, price: 750, image: 'https://i.imgur.com/XXocy8y.png' },
    { code: 'sb', name: 'Strawberry', chance_min: 0.6, chance_max: 5, price: 750, image: 'https://i.imgur.com/MVvL7M1.png' },
    { code: 'cm', name: 'Camera', chance_min: 0.6, chance_max: 5, price: 750, image: 'https://i.imgur.com/kCP8DD9.png' },
    { code: 'sx', name: 'Saxophone', chance_min: 0.6, chance_max: 5, price: 750, image: 'https://i.imgur.com/r9Bn7Xn.png' },
    { code: 'ck', name: 'Cheese Kimbap', chance_min: 0.6, chance_max: 5, price: 750, image: 'https://i.imgur.com/LHXMx6o.png' },
    { code: 'th', name: 'Thomas the Train', chance_min: 0.6, chance_max: 5, price: 750, image: 'https://i.imgur.com/4AiC8zx.png' },
    { code: 'bw', name: 'Archery Bow', chance_min: 0.6, chance_max: 5, price: 750, image: 'https://i.imgur.com/cEMhTQx.jpg' },
    { code: 'sw', name: 'Black Swan', chance_min: 0.6, chance_max: 5, price: 750, image: 'https://i.imgur.com/qOufKJA.png' },

    { code: 'jkb', name: 'JYP\'s MIDI Keyboard', chance_min: 0, chance_max: 0.5, price: 4000, image: 'https://i.imgur.com/4PW4KE5.png' },
    { code: 'ptp', name: 'JYP Plastic Pants', chance_min: 0, chance_max: 0.5, price: 4000, image: 'https://i.imgur.com/yEpLsr0.png' },
    { code: 'idl', name: 'Idol Room Shirt', chance_min: 0, chance_max: 0.5, price: 4000, image: 'https://i.imgur.com/WY1TCJe.png' },
    { code: 'sxt', name: 'Sixteen Necklace', chance_min: 0, chance_max: 0.5, price: 4000, image: 'https://i.imgur.com/uRinEh7.png' },
    { code: 'psw', name: 'Pocari Sweat', chance_min: 0, chance_max: 0.5, price: 4000, image: 'https://i.imgur.com/bg0zHIp.png' },
    { code: 'yoy', name: 'Yes or Yes Dice', chance_min: 0, chance_max: 0.5, price: 4000, image: 'https://i.imgur.com/EaE1r8L.png' },
    { code: 'chj', name: 'Cheer Up Jacket', chance_min: 0, chance_max: 0.5, price: 4000, image: 'https://i.imgur.com/s0wo5mo.jpg' },
    { code: 'lkc', name: 'Likey Video Camera', chance_min: 0, chance_max: 0.5, price: 4000, image: 'https://i.imgur.com/VJGe6oO.jpg' },
    { code: 'jhp', name: 'Jihyo\'s Photobook', chance_min: 0, chance_max: 0.5, price: 4000, image: 'https://i.imgur.com/M3Sf2ew.png' },
    { code: 'chd', name: 'Chaeyoung\'s Drawing', chance_min: 0, chance_max: 0.5, price: 4000, image: 'https://i.imgur.com/Ib23ete.jpg' },
    { code: 'mmc', name: 'Momo\'s Circle', chance_min: 0, chance_max: 0.5, price: 4000, image: 'https://i.imgur.com/FecM5ob.png' },
    { code: 'dbc', name: 'Dubu Cushion', chance_min: 0, chance_max: 0.5, price: 4000, image: 'https://i.ytimg.com/vi/Wqj15fbhKu4/maxresdefault.jpg' },
    { code: 'gci', name: 'Gucci', chance_min: 0, chance_max: 0.5, price: 4000, image: 'https://i.imgur.com/JIfD9dH.png' },
    { code: 'kng', name: 'Kkaengi', chance_min: 0, chance_max: 0.5, price: 4000, image: 'https://i.imgur.com/gax0X5t.png' },
    { code: 'sgt', name: 'Sana\'s Green Tea', chance_min: 0, chance_max: 0.5, price: 4000, image: 'https://i.imgur.com/Bpo59eZ.png' },
    { code: 'jyl', name: 'Jeongyeon\'s Legos', chance_min: 0, chance_max: 0.5, price: 4000, image: 'https://i.imgur.com/Gvi0yD7.png' },
    { code: 'mnl', name: 'Mina\'s Laptop', chance_min: 0, chance_max: 0.5, price: 4000, image: 'https://i.imgur.com/ZTyTkiG.png' },
  ];

  await knex('items').insert(items);
};

/** @param {import('knex').Knex} knex */
exports.down = async function(knex)
{
  await knex('items').truncate();
};
