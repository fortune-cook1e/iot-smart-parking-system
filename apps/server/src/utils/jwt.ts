import jwt, { SignOptions } from 'jsonwebtoken';
import { tokenBlacklist } from './token-blacklist';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
  iat?: number; // issued at
  exp?: number; // expiration time
}

/**
 * Generate JWT token
 */
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JwtPayload {
  try {
    // Check if token is blacklisted (logged out)
    if (tokenBlacklist.has(token)) {
      throw new Error('Token has been revoked');
    }

    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Revoke token (add to blacklist)
 */
export function revokeToken(token: string): void {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    if (decoded && decoded.exp) {
      // Add to blacklist with expiry time (in milliseconds)
      tokenBlacklist.add(token, decoded.exp * 1000);
    }
  } catch {
    // If decode fails, ignore
  }
}

/**
 * Decode JWT token without verification (for debugging)
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
}
