const tableName = 'bits';

/** @param {import('knex').Knex} knex */
exports.up = async function(knex)
{
  if(await knex.schema.hasTable(tableName))
    return;

  await knex.schema.createTable(tableName, table =>
  {
    table.increments('id');

    table.uuid('uuid').unique().notNullable();
    table.text('content').index();

    table.date('created_at').index().defaultTo(knex.fn.now());
    table.date('updated_at').index();
    table.date('deleted_at').index();
  });
};

/** @param {import('knex').Knex} knex */
exports.down = async function(knex)
{
  await knex.schema.dropTableIfExists(tableName);
};
