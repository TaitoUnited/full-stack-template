import InfraRoute from './infra/infra.route';
import FileRoute from './examples/files/file.route';
import UserRoute from './examples/users/user.route';

const routes = (router) => {
  const uptimezRoute = new InfraRoute();
  router.use('/infra', uptimezRoute.routes(), uptimezRoute.allowedMethods());
  const fileRoute = new FileRoute();
  router.use('/files', fileRoute.routes(), fileRoute.allowedMethods());
  const userRoute = new UserRoute();
  router.use('/users', userRoute.routes(), userRoute.allowedMethods());
};

export default routes;
