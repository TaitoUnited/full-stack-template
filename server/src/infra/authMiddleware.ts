import Koa, { Context } from 'koa';
import jwt from 'koa-jwt';
import { koaJwtSecret } from 'jwks-rsa';
import Container from 'typedi';
import config from '../common/setup/config';
import { Db } from '../common/types/context';
import { UserDao } from '../core/daos/UserDao';

const userDao = Container.get(UserDao);

const jwtSecret = koaJwtSecret({
  jwksUri: `https://${config.AUTH0_DOMAIN}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
});

const jwtCheck = jwt({
  secret: jwtSecret,
  audience: config.AUTH0_AUDIENCE,
  issuer: `https://${config.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
  passthrough: true,
  // cookie: 'app:token',
});

async function handleUnknownExternalUserId(tx: Db, externalUserId: string) {
  // TODO: Handle missing db user here depending on your app logic. For example,
  // if your app supports multiple login methods, but you don't wan't to merge
  // users on Auth0, you can do the following:
  //
  // - Check that user has verified his email address.
  // - Check if we already have a user in our database with the given email.
  // - If user was found from database, add a new externalUserId for it,
  //   otherwise create a new user to database.

  return null;
}

const addUserInfo = async (ctx: Context, next: () => Promise<void>) => {
  const { user } = ctx.state;
  if (!user) {
    return next();
  }

  const appUser = await userDao.readByExternalUserId(ctx.state.tx, user.sub);
  if (appUser) {
    ctx.state.appUser = appUser;
    return next();
  }

  await ctx.state.db.tx(async (tx: Db) => {
    ctx.state.appUser = await handleUnknownExternalUserId(tx, user.sub);
  });
  return next();
};

const applyAuthMiddleware = (app: Koa) => {
  app.use(jwtCheck);
  app.use(addUserInfo);
};

export default applyAuthMiddleware;
