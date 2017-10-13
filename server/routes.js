import FileRoute from './files/file.route';
import UserRoute from './users/user.route';
import InfraRoute from './infra/infra.route';

const routes = (router) => {
  const fileRoute = new FileRoute();
  const userRoute = new UserRoute();
  const infraRoute = new InfraRoute();

  router.use(fileRoute.path,
    fileRoute.routes(),
    fileRoute.allowedMethods()
  );

  router.use(userRoute.path,
    userRoute.routes(),
    userRoute.allowedMethods()
  );

  router.use(infraRoute.path,
    infraRoute.routes(),
    infraRoute.allowedMethods()
  );
};

export default routes;
