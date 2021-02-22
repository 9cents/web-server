const conf = require('./db.config');

const { Pool } = require("pg");
const pool = new Pool({
  user: conf.USER,
  host: conf.HOST,
  database: conf.DB,
  password: conf.PASSWORD,
  port: 5432
});

module.exports = pool;