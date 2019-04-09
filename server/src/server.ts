import Koa from "koa";
import patchKoaQs from "koa-qs";
import config from "./common/config";
import db from "./common/db";
import log from "./common/log";
import dbTransactionMiddleware from "./infra/dbTransactionMiddleware";
import errorHandlerMiddleware from "./infra/errorHandlerMiddleware";
import initSentry from "./infra/initSentry";
import requestLoggerMiddleware from "./infra/requestLoggerMiddleware";
import routerMiddlewares from "./routerMiddlewares";

initSentry();

const server = new Koa();
// Add support for query parameter nesting
patchKoaQs(server);

// Request context prototype
server.context.log = log;
server.context.db = db;

// Middlewares
server.use(requestLoggerMiddleware); // Assume no errors in logging
server.use(errorHandlerMiddleware);
server.use(dbTransactionMiddleware);
routerMiddlewares.forEach(middleware => {
  server.use(middleware);
});

server.listen(config.API_PORT, config.API_BINDADDR, () => {
  log.info(
    {
      name: config.APP_NAME,
      address: config.API_BINDADDR,
      port: config.API_PORT
    },
    "Server started"
  );
});
