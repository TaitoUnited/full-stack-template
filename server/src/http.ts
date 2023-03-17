import http from 'http';
import Koa from 'koa';
// import { WebSocketServer } from 'ws';

export const server = new Koa();
export const httpServer = http.createServer(server.callback());

// Uncomment this if you need subscriptions
// export const wsServer = new WebSocketServer({
//   server: httpServer,
//   path: '/subscriptions',
// });
