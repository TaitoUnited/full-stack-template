import InfraRoute from './infra/infra.route';

const routes = router => {
  // Infra
  const infraRoute = new InfraRoute();
  router.use(infraRoute.path, infraRoute.routes(), infraRoute.allowedMethods());
};

export default routes;
