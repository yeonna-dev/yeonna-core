const tableName = 'items';

/** @param {import('knex').Knex} knex */
exports.up = async function(knex)
{
  if(await knex.schema.hasTable(tableName))
    return;

  await knex.schema.createTable(tableName, table =>
  {
    table.increments('pk_id');

    table.string('category_id', 15).index();
    table.string('code').unique();
    table.string('name').unique();
    table.decimal('chance_min');
    table.decimal('chance_max');
    table.decimal('price').defaultTo(0);
    table.string('image');
    table.string('emote');

    table.dateTime('created_at').index().defaultTo(knex.fn.now());
    table.dateTime('updated_at').index();
    table.dateTime('deleted_at').index();
  });
};

/** @param {import('knex').Knex} knex */
exports.down = async function(knex)
{
  await knex.schema.dropTableIfExists(tableName);
};
