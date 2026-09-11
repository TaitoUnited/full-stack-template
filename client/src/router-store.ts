type Router = {
  invalidate: () => Promise<void>;
  navigate: ({ to }: { to: string }) => Promise<void>;
};

let router: Router | undefined;

export function getRouter() {
  if (!router) {
    throw new Error('Router has not been initialized.');
  }

  return router;
}

export function setRouter(value: Router) {
  router = value;
}
