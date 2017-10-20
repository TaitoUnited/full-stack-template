import FileRoute from './files/file.route';
import UserRoute from './users/user.route';
import InfraRoute from './infra/infra.route';

const routes = router => {
  const fileRoute = new FileRoute();
  router.use(fileRoute.path, fileRoute.routes(), fileRoute.allowedMethods());

  const userRoute = new UserRoute();
  router.use(userRoute.path, userRoute.routes(), userRoute.allowedMethods());

  const infraRoute = new InfraRoute();
  router.use(infraRoute.path, infraRoute.routes(), infraRoute.allowedMethods());
};

export default routes;
