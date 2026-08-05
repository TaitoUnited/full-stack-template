import { type FastifyRequest } from 'fastify';
import type { SerializeOptions } from '@fastify/cookie';
import cookie from '@fastify/cookie';
import { eq, sql } from 'drizzle-orm';

import { config } from './config';
import type { DrizzleDb } from '~/db';
import type { DBSession } from '~/src/session/session.db';
import { sessionTable } from '~/src/session/session.db';

type SessionOut<SessionAttributes> = SessionAttributes & {
  id: string;
  fresh: boolean;
};

type SessionOptions = {
  refreshToken: string | null;
  refreshTokenExpiresAt: Date | null;
};

export type Cookie = {
  name: string;
  value: string;
  attributes: SerializeOptions;
};

type Attributes = {
  refreshToken: string | null;
  refreshTokenExpiresAt: Date | null;
};

class Auth<SessionAttributes> {
  public constructor(
    private readonly db: DrizzleDb,
    private readonly getSessionAttributes: (
      session: DBSession
    ) => SessionAttributes
  ) {}

  public readSessionCookie(cookieHeader: string): string | null {
    const { [config.SESSION_COOKIE]: sessionId } = cookie.parse(cookieHeader);
    return sessionId ?? null;
  }

  public readBearerToken(authHeader: string): string | null {
    const result = /Bearer ([a-zA-Z0-9=+/]+)/.exec(authHeader);
    if (!result?.length) {
      return null;
    }
    return result[1] ?? null;
  }

  public async createSession(
    userId: string,
    sessionData: SessionOptions
  ): Promise<SessionOut<SessionAttributes>> {
    const session = await this.db
      .insert(sessionTable)
      .values({
        ...sessionData,
        userId,
        id: this.createSessionId(),
        expiresAt: sql`NOW() + interval '8 hours'`,
      })
      .returning()
      .then((rows) => rows[0]!);

    return this.formatSession(session);
  }

  public createSessionCookie(sessionId: string): Cookie {
    return {
      name: config.SESSION_COOKIE,
      value: sessionId,
      attributes: this.cookieAttributes(),
    };
  }

  public createBlankSessionCookie(): Cookie {
    return {
      name: config.SESSION_COOKIE,
      value: '',
      attributes: this.cookieAttributes(),
    };
  }

  public async validateSession(sessionId: string) {
    const session = await this.fetchSession(sessionId);

    if (!session) {
      return { session: null, user: null };
    }

    return {
      session: this.formatSession(session),
      user: {
        id: session.userId,
      },
    };
  }

  public async invalidateSession(sessionId: string) {
    await this.db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
  }

  private createSessionId(): string {
    const buffer = new Uint8Array(32);
    crypto.getRandomValues(buffer);

    return Buffer.from(buffer).toString('base64');
  }

  private fetchSession(sessionId: string): Promise<DBSession | null> {
    return this.db
      .select()
      .from(sessionTable)
      .where(eq(sessionTable.id, sessionId))
      .then((rows) => rows[0] ?? null);
  }

  private formatSession(session: DBSession): SessionOut<SessionAttributes> {
    return {
      ...this.getSessionAttributes(session),
      id: session.id,
      fresh: session.expiresAt > new Date(),
    };
  }

  private cookieAttributes(): SerializeOptions {
    return {
      secure: config.COMMON_ENV !== 'local',
      domain: config.COMMON_DOMAIN,
      httpOnly: true,
      path: '/',
      maxAge: 8 * 3_600,
    };
  }
}

export type Authenticator = Auth<Attributes>;

export type Session = SessionOut<Attributes>;

export function getAuth(db: DrizzleDb): Authenticator {
  return new Auth(db, (session) => ({
    refreshToken: session.refreshToken,
    refreshTokenExpiresAt: session.refreshTokenExpiresAt,
  }));
}

export function hasValidSession(ctx: FastifyRequest['ctx']) {
  return !!ctx.user && !!ctx.user.session;
}
