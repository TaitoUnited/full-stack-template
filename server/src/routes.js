import Router from 'koa-router';
import FileRoute from './content/file.route';
import InfraRoute from './infra/infra.route';
import PostRoute from './content/post.route';

const connectRoute = (root, routerClass, prefix = '/') => {
  const base = new Router();
  base.use(prefix);
  const route = new routerClass();
  base.use(route.path, route.routes(), route.allowedMethods());
  root.use(base.routes(), base.allowedMethods());
};

const routes = rootRouter => {
  // NOTE: Add your routes here
  const routers = [FileRoute, InfraRoute, PostRoute];
  routers.forEach(router => connectRoute(rootRouter, router));
};

export default routes;
