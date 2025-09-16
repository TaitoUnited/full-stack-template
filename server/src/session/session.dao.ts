import { type DrizzleDb } from '~/db';
import { comparePassword } from '~/src/utils/password';
import { isValidPassword, isValidEmail } from '~/src/utils/validation';
import { userDao } from '../user/user.dao';
import { organisationDao } from '../organisation/organisation.dao';
import { LoginOptions } from '~/types/login';
import { Cookie } from '../utils/authentication';

/**
 * Cookie-based login with email and password.
 * This should be used for web apps.
 */
async function login(
  db: DrizzleDb,
  { email, password, auth }: LoginOptions
): Promise<{ cookie: Cookie }> {
  const user = await validateLogin({ db, email, password });
  const session = await auth.createSession(user.id, {
    refreshToken: null,
    refreshTokenExpiresAt: null,
  });
  const cookie = auth.createSessionCookie(session.id);

  await userDao.updateUserLastLogin(db, user.id);

  return { cookie };
}

/**
 * Token-based login with email and password.
 * This should be used for mobile apps.
 */
async function tokenLogin(
  db: DrizzleDb,
  { email, password, auth }: LoginOptions
) {
  const user = await validateLogin({ db, email, password });
  const session = await auth.createSession(user.id, {
    refreshToken: null,
    refreshTokenExpiresAt: null,
  });

  await userDao.updateUserLastLogin(db, user.id);

  return { sessionId: session.id };
}

// Helpers

export class LoginError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'LoginError';
    this.status = status;
  }
}

async function validateLogin({
  db,
  email,
  password,
}: {
  db: DrizzleDb;
  email: string;
  password: string;
}) {
  if (!isValidPassword(password)) {
    throw new LoginError(400, 'Invalid password');
  }

  if (!isValidEmail(email)) {
    throw new LoginError(400, 'Invalid email');
  }

  const [user] = await userDao.getUserByEmail(db, email);

  if (!user) {
    throw new LoginError(401, 'Invalid credentials');
  }

  const validPassword = await comparePassword({
    password: password,
    hash: user.passwordHash,
  });

  if (!validPassword) {
    throw new LoginError(401, 'Invalid credentials');
  }

  const userOrganisations = await organisationDao.getUserOrganisations(
    db,
    user.id
  );

  if (userOrganisations.length === 0) {
    throw new LoginError(401, 'User does not belong to any organisation');
  }

  return user;
}

export const sessionDao = {
  login,
  tokenLogin,
  LoginError,
};
