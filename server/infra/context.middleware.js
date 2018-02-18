const contextMiddleware = async (ctx, next) => {
  ctx.state = {
    user: {},
  };
  await next();
};

export default contextMiddleware;
