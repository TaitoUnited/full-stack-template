
const contextMiddleware = async (ctx, next) => {
  ctx.appCtx = {
    user: {},
  };
  await next();
};

export default contextMiddleware;
