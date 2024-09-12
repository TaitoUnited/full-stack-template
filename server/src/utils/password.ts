import { hash, verify, Options } from '@node-rs/argon2';

/**
 * Recommended minimum parameters by Lucia:
 * https://lucia-auth.com/guides/email-and-password/basics
 */
const options: Options = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export async function hashPassword(password: string) {
  return hash(password, options);
}

export async function comparePassword(args: {
  password: string;
  hash: string;
}) {
  return verify(args.hash, args.password, options);
}
