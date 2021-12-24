import knex from 'knex';

const pg = require('pg');
pg.types.setTypeParser(pg.types.builtins.INT8, (value: string) => Number(value));
pg.types.setTypeParser(pg.types.builtins.FLOAT8, (value: string) => Number(value));
pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) => Number(value));

const db = knex({
  client: 'pg',
  connection: process.env.DB_CONNECTION,
});

if(process.env.DEBUG)
  db.on('query', ({ sql }) => console.log(`[Knex Query]: ${sql}`));

export class DB
{
  static knex = db;
  static users = () => db('users');
  static obtainables = () => db('obtainables');
  static items = () => db('items');
  static inventories = () => db('inventories');
  static bits = () => db('bits');
  static usersBits = () => db('users_bits');
  static tags = () => db('tags');

  static discordRoleRequests = () => db('discord_role_requests');
}

export interface TimestampedRecord
{
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
