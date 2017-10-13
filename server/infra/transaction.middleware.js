import pg from 'pg-promise';

import config from '../common/app.config';

const pgp = pg({
  // Initialization options
});

const cn = {
  host: config.DATABASE_HOST,
  port: parseInt(config.DATABASE_PORT, 10),
  database: config.DATABASE_ID,
  user: config.DATABASE_USER,
  password: config.DATABASE_SECRET,
  poolSize: config.DATABASE_POOL_MAX,
};

const db = pgp(cn);

// Transaction manager
// NOTE: Experimental ;)
const transactionMiddleware = async (ctx, next) => {
  const appCtx = ctx.appCtx;

  // Add db to context. Use txArray to keep record of nested transactions
  // of pg-promise.
  // TODO: or could we just always use the root transaction?
  appCtx.db = db;
  appCtx.txArray = [];
  appCtx.txArray.push(db);
  appCtx.getTx = () => {
    return appCtx.txArray[appCtx.txArray.length - 1];
  };

  // Keep current transaction always in appCtx in case we have to call
  // one service from another service -> another service can join
  // the transaction without having to pass the current transaction as parameter
  // from one service to another.
  // NOTE: not yet tried if this really works or not :P
  // TODO: for avoiding mistakes it might be better if also DAOs always
  // retrieve db from appCtx instead using the one that service gave
  // as parameter -> DAOs always join the current transaction determined
  // by service.
  appCtx.tx = (func) => {
    appCtx.getTx().tx((tx) => {
      // Push transaction
      appCtx.txArray.push(tx);

      // Execute
      return func(tx)

      // Pop transaction
      .then((ret) => {
        appCtx.txArray.pop();
        return ret;
      })
      .catch((error) => {
        appCtx.txArray.pop();
        return Promise.reject(error);
      });
    });
  };

  await next();
};

export default transactionMiddleware;
