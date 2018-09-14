const authMiddleware = async (ctx, next) => {
  // NOTE: Using hard-coded role (no auth implemented).
  ctx.state = {
    user: {
      role: 'admin',
    },
  };
  await next();
};

export default authMiddleware;
