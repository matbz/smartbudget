const promise = require('bluebird');
const config = require('../config');

const initOptions = {
    promiseLib: promise,
};

const db_config = {
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password
};

const pgp = require('pg-promise')(initOptions);

const db = pgp(db_config);

module.exports = db;
