const tableName = 'obtainables';

/** @param {import('knex').Knex} knex */
exports.up = async function(knex)
{
  if(await knex.schema.hasTable(tableName))
    return;

  await knex.schema.createTable(tableName, table =>
  {
    table.increments('id');

    table.uuid('user_uuid').index().notNullable();
    table.string('discord_guild_id').index();
    table.decimal('amount', 20).defaultTo(0);
    table.boolean('is_collectible');

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
