import pg from 'pg-promise';

import config from '../common/common.config';

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
  const { state } = ctx;

  // Add db to context. Use txArray to keep record of nested transactions
  // of pg-promise.
  // TODO: or could we just always use the root transaction?
  state.db = db;
  state.txArray = [];
  state.txArray.push(db);
  state.getTx = () => {
    return state.txArray[state.txArray.length - 1];
  };

  // Keep current transaction always in state in case we have to call
  // one service from another service -> another service can join
  // the transaction without having to pass the current transaction as parameter
  // from one service to another.
  // NOTE: not yet tried if this really works or not :P
  // TODO: for avoiding mistakes it might be better if also DAOs always
  // retrieve db from state instead using the one that service gave
  // as parameter -> DAOs always join the current transaction determined
  // by service.
  state.tx = func => {
    state.getTx().tx(tx => {
      // Push transaction
      state.txArray.push(tx);

      // Execute
      return (
        func(tx)
          // Pop transaction
          .then(ret => {
            state.txArray.pop();
            return ret;
          })
          .catch(error => {
            state.txArray.pop();
            return Promise.reject(error);
          })
      );
    });
  };

  await next();
};

export default transactionMiddleware;
