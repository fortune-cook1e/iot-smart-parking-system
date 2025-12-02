/**
 * Token blacklist for logout functionality
 * In production, use Redis for distributed systems
 */
class TokenBlacklist {
  private blacklist: Set<string> = new Set();
  private expiryMap: Map<string, number> = new Map();

  /**
   * Add token to blacklist
   */
  add(token: string, expiresAt: number): void {
    this.blacklist.add(token);
    this.expiryMap.set(token, expiresAt);
  }

  /**
   * Check if token is blacklisted
   */
  has(token: string): boolean {
    // Clean expired tokens first
    this.cleanup();
    return this.blacklist.has(token);
  }

  /**
   * Remove expired tokens from blacklist
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [token, expiresAt] of this.expiryMap.entries()) {
      if (expiresAt < now) {
        this.blacklist.delete(token);
        this.expiryMap.delete(token);
      }
    }
  }

  /**
   * Clear all tokens (for testing)
   */
  clear(): void {
    this.blacklist.clear();
    this.expiryMap.clear();
  }
}

// Singleton instance
export const tokenBlacklist = new TokenBlacklist();
