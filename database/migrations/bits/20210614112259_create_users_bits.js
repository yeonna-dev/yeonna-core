const tableName = 'users_bits';

/** @param {import('knex').Knex} knex */
exports.up = async function(knex)
{
  if(await knex.schema.hasTable(tableName))
    return;

  await knex.schema.createTable(tableName, table =>
  {
    table.increments('pk_id');

    table.string('user_id', 15)
      .index()
      .notNullable()
      .references('id')
      .inTable('users');

    table.string('bit_id', 15)
      .index()
      .notNullable()
      .references('id')
      .inTable('bits');

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
