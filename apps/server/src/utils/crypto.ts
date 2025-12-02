import crypto from 'crypto';

/**
 * Generate a random salt
 */
export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Hash password with salt using PBKDF2
 */
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, salt: string, hash: string): boolean {
  const hashToVerify = hashPassword(password, salt);
  return hashToVerify === hash;
}
