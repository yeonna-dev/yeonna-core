const tableName = 'users_bits';

/** @param {import('knex').Knex} knex */
exports.up = async function(knex)
{
  if(await knex.schema.hasTable(tableName))
    return;

  await knex.schema.createTable(tableName, table =>
  {
    table.increments('id');

    table.uuid('user_uuid').unique().notNullable();
    table.uuid('bit_uuid').unique().notNullable();

    table.date('created_at').index('created_at').defaultTo(knex.fn.now());
    table.date('updated_at').index('updated_at');
    table.date('deleted_at').index('deleted_at');
  });
};

/** @param {import('knex').Knex} knex */
exports.down = async function(knex)
{
  await knex.schema.dropTableIfExists(tableName);
};
