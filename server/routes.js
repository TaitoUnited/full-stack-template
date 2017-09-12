import FileRoute from './examples/files/file.route';
import UserRoute from './examples/users/user.route';
import InfraRoute from './infra/infra.route';

const routes = (router) => {
  const fileRoute = new FileRoute();
  const userRoute = new UserRoute();
  const infraRoute = new InfraRoute();

  router.use('/files',
    fileRoute.routes(),
    fileRoute.allowedMethods()
  );

  router.use('/users',
    userRoute.routes(),
    userRoute.allowedMethods()
  );

  router.use('/infra',
    infraRoute.routes(),
    infraRoute.allowedMethods()
  );
};

export default routes;
