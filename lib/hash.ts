import sha256 from 'crypto-js/sha256';

export const hashPassword = (password: string): string =>
  sha256(password).toString();

export const compareHash = (password: string, hash: string): boolean =>
  hashPassword(password) === hash;
