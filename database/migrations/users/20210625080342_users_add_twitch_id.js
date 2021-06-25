const tableName = 'users';
const newColumn = 'twitch_id';

/** @param {import('knex').Knex} knex */
exports.up = async function(knex)
{
  await knex.schema.alterTable(tableName, table =>
  {
    table.string(newColumn).unique();
  });
};

/** @param {import('knex').Knex} knex */
exports.down = async function(knex)
{
  await knex.schema.alterTable(tableName, table =>
  {
    table.dropColumn(newColumn);
  });
};
