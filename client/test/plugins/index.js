// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// import pg from 'pg-promise';
const fs = require('fs');
const pg = require('pg-promise');
const pgp = pg({});

const readSecretSync = (filename) => {
  let value = null;
  try {
    value = fs.readFileSync(filename, 'utf8');
  } catch (err) {
    console.warn(`WARNING: failed to read secret from ${filename}`);
  }
  return value;
};

let dbOverrides = {};
try {
  dbOverrides = require('../db.json'); // eslint-disable-line
} catch (ex) {}

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
// `on` is used to hook into various events Cypress emits
// `config` is the resolved Cypress config
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // Configure database connection
  const dbConfig = {
    host: process.env.DATABASE_HOST || dbOverrides.DATABASE_HOST || '127.0.0.1',
    port: parseInt(
      process.env.DATABASE_PORT ||
        dbOverrides.DATABASE_PORT ||
        process.env.db_database_external_port ||
        process.env.db_database_port,
      10
    ),
    database:
      process.env.DATABASE_NAME ||
      dbOverrides.DATABASE_NAME ||
      process.env.db_database_name,
    user:
      process.env.DATABASE_USER ||
      dbOverrides.DATABASE_USER ||
      (process.env.db_database_name && `${process.env.db_database_name}_app`), // eslint-disable-line
    password:
      process.env.DATABASE_PASSWORD ||
      dbOverrides.DATABASE_PASSWORD ||
      readSecretSync('/run/secrets/DATABASE_PASSWORD') ||
      process.env.taito_default_password ||
      'secret',
    ssl:
      process.env.DATABASE_SSL_ENABLED !== 'false' &&
      process.env.DATABASE_SSL_CLIENT_CERT_ENABLED === 'true'
        ? {
            ca: readSecretSync('/run/secrets/DATABASE_SSL_CA'),
            cert: readSecretSync('/run/secrets/DATABASE_SSL_CERT'),
            key: readSecretSync('/run/secrets/DATABASE_SSL_KEY'),
          }
        : // TODO: enable once it works with AWS CI/CD
        // : process.env.DATABASE_SSL_ENABLED !== 'false' &&
        //   process.env.DATABASE_SSL_SERVER_CERT_ENABLED === 'true'
        // ? {
        //     ca: readSecretSync('/run/secrets/DATABASE_SSL_CA'),
        //   }
        process.env.DATABASE_SSL_ENABLED !== 'false'
        ? { rejectUnauthorized: false }
        : false,
    poolSize: 2,
    statement_timeout: 1 * 60 * 1000, // 1 min
  };
  console.log(`URL: ${config.baseUrl}`);
  console.log(
    `DATABASE: ${dbConfig.user}:PASSWORD@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
  );
  if (process.env.taito_target_env !== 'local') {
    console.log(
      '\nNOTE: If your tests need database connection, you might need to\n' +
        `start a db proxy: 'taito db proxy:${process.env.taito_target_env}'`
    );
  }
  console.log('--------------------------------------------------------------');
  const db = pgp(dbConfig);

  // sql task
  on('task', {
    sql: (sql) => {
      return db.any(sql);
    },
  });
};
