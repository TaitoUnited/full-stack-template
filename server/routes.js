import FileRoute from './files/file.route';
import PostRoute from './posts/post.route';
import TagRoute from './posts/tag.route';
import CommentRoute from './posts/comment.route';
import AuthRoute from './users/auth.route';
import UserRoute from './users/user.route';
import InfraRoute from './infra/infra.route';

const routes = router => {
  // Files
  const fileRoute = new FileRoute();
  router.use(fileRoute.path, fileRoute.routes(), fileRoute.allowedMethods());

  // Posts
  const postRoute = new PostRoute();
  router.use(postRoute.path, postRoute.routes(), postRoute.allowedMethods());
  const tagRoute = new TagRoute();
  router.use(tagRoute.path, tagRoute.routes(), tagRoute.allowedMethods());
  const commentRoute = new CommentRoute();
  router.use(
    commentRoute.path,
    commentRoute.routes(),
    commentRoute.allowedMethods()
  );

  // Users
  const authRoute = new AuthRoute();
  router.use(authRoute.path, authRoute.routes(), authRoute.allowedMethods());
  const userRoute = new UserRoute();
  router.use(userRoute.path, userRoute.routes(), userRoute.allowedMethods());

  // Infra
  const infraRoute = new InfraRoute();
  router.use(infraRoute.path, infraRoute.routes(), infraRoute.allowedMethods());
};

export default routes;
