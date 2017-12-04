const path = require('path');

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'matbzdbpw555',
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'sbJWTsecret'
  }
};

