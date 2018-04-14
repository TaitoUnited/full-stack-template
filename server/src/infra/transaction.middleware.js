import db from '../common/db.util';

// Transaction manager
const transactionMiddleware = async (ctx, next) => {
  const { state } = ctx;
  state.db = db;
  state.getTx = () => db;

  if (
    ctx.method === 'POST' ||
    ctx.method === 'PUT' ||
    ctx.method === 'PATCH' ||
    ctx.method === 'DELETE'
  ) {
    // Transactional
    await db.tx(async tx => {
      state.getTx = () => tx;
      await next();
    });
  } else {
    // Non-transactional
    await next();
  }
};

export default transactionMiddleware;
