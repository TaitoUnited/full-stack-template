import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-koa';

import { UserRole } from '../types/context';
import { readSecret } from '../setup/config';

type TokenResult =
  | { kind: 'success'; accessToken: string; refreshToken: string }
  | { kind: 'fail'; reason: string };

async function getSessionSecret() {
  const secret = await readSecret('SESSION');

  if (!secret) {
    throw new Error('Session secrent not found');
  }

  return secret;
}

async function generateToken({
  id,
  role,
  kind,
  expiresIn,
}: {
  id: string;
  role: UserRole;
  kind: 'api' | 'refresh';
  expiresIn: string;
}) {
  const secret = await getSessionSecret();

  return jwt.sign({ id, role, kind }, secret, {
    algorithm: 'HS256',
    expiresIn,
  });
}

async function generateTokens(id: string, role: UserRole) {
  const accessToken = await generateToken({
    id,
    role,
    kind: 'api',
    expiresIn: '90d',
  });
  const refreshToken = await generateToken({
    id,
    role,
    kind: 'refresh',
    expiresIn: '1y',
  });
  return { accessToken, refreshToken };
}

export async function checkLogin(
  user: { id: string; passHash: string },
  password: string,
  role: UserRole
): Promise<TokenResult> {
  const success = await bcrypt.compare(password, user.passHash);

  if (!success) {
    return { kind: 'fail', reason: 'Invalid password.' };
  }

  const { accessToken, refreshToken } = await generateTokens(user.id, role);

  return { kind: 'success', accessToken, refreshToken };
}

export async function refreshTokens(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  try {
    const secret = await getSessionSecret();
    const user = jwt.verify(refreshToken, secret) as jwt.JwtPayload;

    if (user.kind !== 'refresh') {
      throw new AuthenticationError('Wrong kind of token');
    }

    return await generateTokens(user.id, user.role);
  } catch (e) {
    console.error(e);
    throw new AuthenticationError('Invalid refresh token');
  }
}
