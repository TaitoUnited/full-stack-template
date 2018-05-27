import InfraRoute from './infra/infra.route';
import AuthRoute from './infra/auth.route';
import PostRoute from './posts/route';

const routes = router => {
  // Infra
  const infraRoute = new InfraRoute();
  router.use(infraRoute.path, infraRoute.routes(), infraRoute.allowedMethods());
  const authRoute = new AuthRoute();
  router.use(authRoute.path, authRoute.routes(), authRoute.allowedMethods());

  // Posts
  const postRoute = new PostRoute();
  router.use(postRoute.path, postRoute.routes(), postRoute.allowedMethods());
};

export default routes;
