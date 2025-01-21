/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/root';
import { Route as layoutImport } from './routes/layout';
import { Route as loginLoginrouteImport } from './routes/login/login.route';
import { Route as indexImport } from './routes/index';
import { Route as workspaceWorkspacerouteImport } from './routes/workspace/workspace.route';
import { Route as themingThemingrouteImport } from './routes/theming/theming.route';
import { Route as postListPostListrouteImport } from './routes/post-list/post-list.route';
import { Route as homeHomerouteImport } from './routes/home/home.route';
import { Route as postCreatePostCreaterouteImport } from './routes/post-create/post-create.route';
import { Route as postPostrouteImport } from './routes/post/post.route';

// Create/Update Routes

const layoutRoute = layoutImport.update({
  id: '/_app',
  getParentRoute: () => rootRoute,
} as any);

const loginLoginrouteRoute = loginLoginrouteImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any);

const indexRoute = indexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => layoutRoute,
} as any);

const workspaceWorkspacerouteRoute = workspaceWorkspacerouteImport.update({
  id: '/$workspaceId',
  path: '/$workspaceId',
  getParentRoute: () => layoutRoute,
} as any);

const themingThemingrouteRoute = themingThemingrouteImport.update({
  id: '/theming',
  path: '/theming',
  getParentRoute: () => workspaceWorkspacerouteRoute,
} as any);

const postListPostListrouteRoute = postListPostListrouteImport.update({
  id: '/posts',
  path: '/posts',
  getParentRoute: () => workspaceWorkspacerouteRoute,
} as any);

const homeHomerouteRoute = homeHomerouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => workspaceWorkspacerouteRoute,
} as any);

const postCreatePostCreaterouteRoute = postCreatePostCreaterouteImport.update({
  id: '/posts_/create',
  path: '/posts/create',
  getParentRoute: () => workspaceWorkspacerouteRoute,
} as any);

const postPostrouteRoute = postPostrouteImport.update({
  id: '/posts_/$id',
  path: '/posts/$id',
  getParentRoute: () => workspaceWorkspacerouteRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/login': {
      id: '/login';
      path: '/login';
      fullPath: '/login';
      preLoaderRoute: typeof loginLoginrouteImport;
      parentRoute: typeof rootRoute;
    };
    '/_app': {
      id: '/_app';
      path: '';
      fullPath: '';
      preLoaderRoute: typeof layoutImport;
      parentRoute: typeof rootRoute;
    };
    '/_app/$workspaceId': {
      id: '/_app/$workspaceId';
      path: '/$workspaceId';
      fullPath: '/$workspaceId';
      preLoaderRoute: typeof workspaceWorkspacerouteImport;
      parentRoute: typeof layoutImport;
    };
    '/_app/': {
      id: '/_app/';
      path: '/';
      fullPath: '/';
      preLoaderRoute: typeof indexImport;
      parentRoute: typeof layoutImport;
    };
    '/_app/$workspaceId/': {
      id: '/_app/$workspaceId/';
      path: '/';
      fullPath: '/$workspaceId/';
      preLoaderRoute: typeof homeHomerouteImport;
      parentRoute: typeof workspaceWorkspacerouteImport;
    };
    '/_app/$workspaceId/posts': {
      id: '/_app/$workspaceId/posts';
      path: '/posts';
      fullPath: '/$workspaceId/posts';
      preLoaderRoute: typeof postListPostListrouteImport;
      parentRoute: typeof workspaceWorkspacerouteImport;
    };
    '/_app/$workspaceId/theming': {
      id: '/_app/$workspaceId/theming';
      path: '/theming';
      fullPath: '/$workspaceId/theming';
      preLoaderRoute: typeof themingThemingrouteImport;
      parentRoute: typeof workspaceWorkspacerouteImport;
    };
    '/_app/$workspaceId/posts_/$id': {
      id: '/_app/$workspaceId/posts_/$id';
      path: '/posts/$id';
      fullPath: '/$workspaceId/posts/$id';
      preLoaderRoute: typeof postPostrouteImport;
      parentRoute: typeof workspaceWorkspacerouteImport;
    };
    '/_app/$workspaceId/posts_/create': {
      id: '/_app/$workspaceId/posts_/create';
      path: '/posts/create';
      fullPath: '/$workspaceId/posts/create';
      preLoaderRoute: typeof postCreatePostCreaterouteImport;
      parentRoute: typeof workspaceWorkspacerouteImport;
    };
  }
}

// Create and export the route tree

interface workspaceWorkspacerouteRouteChildren {
  homeHomerouteRoute: typeof homeHomerouteRoute;
  postListPostListrouteRoute: typeof postListPostListrouteRoute;
  themingThemingrouteRoute: typeof themingThemingrouteRoute;
  postPostrouteRoute: typeof postPostrouteRoute;
  postCreatePostCreaterouteRoute: typeof postCreatePostCreaterouteRoute;
}

const workspaceWorkspacerouteRouteChildren: workspaceWorkspacerouteRouteChildren =
  {
    homeHomerouteRoute: homeHomerouteRoute,
    postListPostListrouteRoute: postListPostListrouteRoute,
    themingThemingrouteRoute: themingThemingrouteRoute,
    postPostrouteRoute: postPostrouteRoute,
    postCreatePostCreaterouteRoute: postCreatePostCreaterouteRoute,
  };

const workspaceWorkspacerouteRouteWithChildren =
  workspaceWorkspacerouteRoute._addFileChildren(
    workspaceWorkspacerouteRouteChildren,
  );

interface layoutRouteChildren {
  workspaceWorkspacerouteRoute: typeof workspaceWorkspacerouteRouteWithChildren;
  indexRoute: typeof indexRoute;
}

const layoutRouteChildren: layoutRouteChildren = {
  workspaceWorkspacerouteRoute: workspaceWorkspacerouteRouteWithChildren,
  indexRoute: indexRoute,
};

const layoutRouteWithChildren =
  layoutRoute._addFileChildren(layoutRouteChildren);

export interface FileRoutesByFullPath {
  '/login': typeof loginLoginrouteRoute;
  '': typeof layoutRouteWithChildren;
  '/$workspaceId': typeof workspaceWorkspacerouteRouteWithChildren;
  '/': typeof indexRoute;
  '/$workspaceId/': typeof homeHomerouteRoute;
  '/$workspaceId/posts': typeof postListPostListrouteRoute;
  '/$workspaceId/theming': typeof themingThemingrouteRoute;
  '/$workspaceId/posts/$id': typeof postPostrouteRoute;
  '/$workspaceId/posts/create': typeof postCreatePostCreaterouteRoute;
}

export interface FileRoutesByTo {
  '/login': typeof loginLoginrouteRoute;
  '/': typeof indexRoute;
  '/$workspaceId': typeof homeHomerouteRoute;
  '/$workspaceId/posts': typeof postListPostListrouteRoute;
  '/$workspaceId/theming': typeof themingThemingrouteRoute;
  '/$workspaceId/posts/$id': typeof postPostrouteRoute;
  '/$workspaceId/posts/create': typeof postCreatePostCreaterouteRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  '/login': typeof loginLoginrouteRoute;
  '/_app': typeof layoutRouteWithChildren;
  '/_app/$workspaceId': typeof workspaceWorkspacerouteRouteWithChildren;
  '/_app/': typeof indexRoute;
  '/_app/$workspaceId/': typeof homeHomerouteRoute;
  '/_app/$workspaceId/posts': typeof postListPostListrouteRoute;
  '/_app/$workspaceId/theming': typeof themingThemingrouteRoute;
  '/_app/$workspaceId/posts_/$id': typeof postPostrouteRoute;
  '/_app/$workspaceId/posts_/create': typeof postCreatePostCreaterouteRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths:
    | '/login'
    | ''
    | '/$workspaceId'
    | '/'
    | '/$workspaceId/'
    | '/$workspaceId/posts'
    | '/$workspaceId/theming'
    | '/$workspaceId/posts/$id'
    | '/$workspaceId/posts/create';
  fileRoutesByTo: FileRoutesByTo;
  to:
    | '/login'
    | '/'
    | '/$workspaceId'
    | '/$workspaceId/posts'
    | '/$workspaceId/theming'
    | '/$workspaceId/posts/$id'
    | '/$workspaceId/posts/create';
  id:
    | '__root__'
    | '/login'
    | '/_app'
    | '/_app/$workspaceId'
    | '/_app/'
    | '/_app/$workspaceId/'
    | '/_app/$workspaceId/posts'
    | '/_app/$workspaceId/theming'
    | '/_app/$workspaceId/posts_/$id'
    | '/_app/$workspaceId/posts_/create';
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  loginLoginrouteRoute: typeof loginLoginrouteRoute;
  layoutRoute: typeof layoutRouteWithChildren;
}

const rootRouteChildren: RootRouteChildren = {
  loginLoginrouteRoute: loginLoginrouteRoute,
  layoutRoute: layoutRouteWithChildren,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "root.tsx",
      "children": [
        "/login",
        "/_app"
      ]
    },
    "/login": {
      "filePath": "login/login.route.tsx"
    },
    "/_app": {
      "filePath": "layout.tsx",
      "children": [
        "/_app/$workspaceId",
        "/_app/"
      ]
    },
    "/_app/$workspaceId": {
      "filePath": "workspace/workspace.route.tsx",
      "parent": "/_app",
      "children": [
        "/_app/$workspaceId/",
        "/_app/$workspaceId/posts",
        "/_app/$workspaceId/theming",
        "/_app/$workspaceId/posts_/$id",
        "/_app/$workspaceId/posts_/create"
      ]
    },
    "/_app/": {
      "filePath": "index.tsx",
      "parent": "/_app"
    },
    "/_app/$workspaceId/": {
      "filePath": "home/home.route.tsx",
      "parent": "/_app/$workspaceId"
    },
    "/_app/$workspaceId/posts": {
      "filePath": "post-list/post-list.route.tsx",
      "parent": "/_app/$workspaceId"
    },
    "/_app/$workspaceId/theming": {
      "filePath": "theming/theming.route.tsx",
      "parent": "/_app/$workspaceId"
    },
    "/_app/$workspaceId/posts_/$id": {
      "filePath": "post/post.route.tsx",
      "parent": "/_app/$workspaceId"
    },
    "/_app/$workspaceId/posts_/create": {
      "filePath": "post-create/post-create.route.tsx",
      "parent": "/_app/$workspaceId"
    }
  }
}
ROUTE_MANIFEST_END */
