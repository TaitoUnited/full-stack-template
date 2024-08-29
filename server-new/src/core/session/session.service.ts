import type { Cookie, Lucia } from 'lucia';

import { type DrizzleDb } from '~/db';
import { isValidPassword, isValidEmail } from '~/common/validation';
import * as userService from '../user/user.service';
import { comparePassword } from '~/common/password';

type LoginError = {
  status: number;
  error: string;
};

export async function login(
  db: DrizzleDb,
  { auth, password, email }: { auth: Lucia; email: string; password: string }
): Promise<{ cookie: Cookie } | LoginError> {
  if (!isValidPassword(password)) {
    return { status: 400, error: 'Invalid password' };
  }

  if (!isValidEmail(email)) {
    return { status: 400, error: 'Invalid email' };
  }

  const [user] = await userService.getUserByEmail(db, email);

  if (!user) {
    return { status: 401, error: 'Invalid credentials' };
  }

  const validPassword = await comparePassword({
    password: password,
    hash: user.passwordHash,
  });

  if (!validPassword) {
    return { status: 401, error: 'Invalid credentials' };
  }

  const session = await auth.createSession(user.id, {});
  const cookie = auth.createSessionCookie(session.id);

  await userService.updateUserLastLogin(db, user.id);

  return { cookie };
}

export async function logout(auth: Lucia, sessionId: string) {
  await auth.invalidateSession(sessionId);
  const cookie = auth.createBlankSessionCookie();
  return cookie;
}
