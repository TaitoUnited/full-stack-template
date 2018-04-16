import db from '../common/db.util';

// Transaction manager
const transactionMiddleware = async (ctx, next) => {
  const { state } = ctx;
  state.db = db;
  state.getTx = () => db;

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(ctx.method)) {
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
