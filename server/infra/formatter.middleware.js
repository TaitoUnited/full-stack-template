// import log from '../log';

const formatterMiddleware = async (ctx, next) => {
  const result = await next();

  const { data, status, error, ...rest } = result;

  // TODO
  if (error) {
    ctx.status = error.status;
    ctx.body = { error };
    ctx.app.emit('error', new Error(result.error.message), ctx);
  } else if (!data) {
    ctx.status = status || 404;
  } else {
    ctx.status = status || 200;
    ctx.body = { data, ...rest };
  }
};

export default formatterMiddleware;
