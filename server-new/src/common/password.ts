import { hashSync } from 'bcrypt';

export function hashPassword(password: string): string {
  return hashSync(password, 12);
}
