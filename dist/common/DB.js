"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const knex_1 = __importDefault(require("knex"));
const pg = require('pg');
pg.types.setTypeParser(pg.types.builtins.INT8, (value) => Number(value));
pg.types.setTypeParser(pg.types.builtins.FLOAT8, (value) => Number(value));
pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value) => Number(value));
const db = knex_1.default({
    client: 'pg',
    connection: process.env.DB_CONNECTION,
});
if (process.env.DEBUG)
    db.on('query', ({ sql }) => console.log(`[Knex Query]: ${sql}`));
class DB {
}
exports.DB = DB;
DB.knex = db;
DB.users = () => db('users');
DB.obtainables = () => db('obtainables');
DB.items = () => db('items');
DB.inventories = () => db('inventories');
DB.collections = () => db('collections');
DB.collectionsItems = () => db('collections_items');
DB.usersCollections = () => db('users_collections');
DB.bits = () => db('bits');
DB.usersBits = () => db('users_bits');
DB.tags = () => db('tags');
DB.discordRoleRequests = () => db('discord_role_requests');
