import { index, layout, rootRoute, route } from '@tanstack/virtual-file-routes';

export const routeConfig = rootRoute('root.tsx', [
  layout('app', 'layout.tsx', [
    index('home/home.route.tsx'),
    route('/$', 'not-found/not-found.route.tsx'),
  ]),
  route('/login', 'login/login.route.tsx'),
]);
