import type { Cookie, Lucia } from 'lucia';

import { type DrizzleDb } from '~/db';
import { comparePassword } from '~/src/utils/password';
import { isValidPassword, isValidEmail } from '~/src/utils/validation';
import * as userService from '../user/user.service';
import * as orgService from '../organisation/organisation.service';

type LoginOptions = {
  email: string;
  password: string;
  auth: Lucia; // Injected auth service from context
};

/**
 * Cookie-based login with email and password.
 * This should be used for web apps.
 */
export async function login(
  db: DrizzleDb,
  { email, password, auth }: LoginOptions
): Promise<{ cookie: Cookie }> {
  const user = await validateLogin({ db, email, password });
  const session = await auth.createSession(user.id, {});
  const cookie = auth.createSessionCookie(session.id);

  await userService.updateUserLastLogin(db, user.id);

  return { cookie };
}

/**
 * Token-based login with email and password.
 * This should be used for mobile apps.
 */
export async function tokenLogin(
  db: DrizzleDb,
  { email, password, auth }: LoginOptions
) {
  const user = await validateLogin({ db, email, password });
  const session = await auth.createSession(user.id, {});

  await userService.updateUserLastLogin(db, user.id);

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

  const [user] = await userService.getUserByEmail(db, email);

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

  const userOrganisations = await orgService.getUserOrganisations(db, user.id);

  if (userOrganisations.length === 0) {
    throw new LoginError(401, 'User does not belong to any organisation');
  }

  return user;
}
