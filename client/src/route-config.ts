import { index, layout, rootRoute, route } from '@tanstack/virtual-file-routes';

export const routeConfig = rootRoute('root.tsx', [
  layout('app', 'layout.tsx', [
    index('index.tsx'),
    route('/$workspaceId', 'workspace/workspace.route.tsx', [
      index('home/home.route.tsx'),
      route('/posts', 'post-list/post-list.route.tsx'),
      route('/posts_/create', 'post-create/post-create.route.tsx'),
      route('/posts_/$id', 'post/post.route.tsx'),
      route('/theming', 'theming/theming.route.tsx'),
    ]),
  ]),
  route('/login', 'login/login.route.tsx'),
]);
