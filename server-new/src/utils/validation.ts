export function isValidEmail(email: string): boolean {
  return /.+@.+/.test(email);
}

export function isValidPassword(password: string) {
  return password.length >= 8 && password.length < 256;
}
