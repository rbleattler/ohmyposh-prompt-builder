/**
 * Utility class for caching and retrieving JSON schema data
 */
export class SchemaCache {
  private static readonly CACHE_KEY = 'oh-my-posh-schema';
  private static readonly CACHE_EXPIRY_KEY = 'oh-my-posh-schema-expiry';
  private static readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  /**
   * Store schema in cache with expiry
   */
  static cacheSchema(schema: any): void {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(schema));
      localStorage.setItem(
        this.CACHE_EXPIRY_KEY,
        String(Date.now() + this.CACHE_TTL)
      );
    } catch (error) {
      console.warn('Failed to cache schema:', error);
    }
  }

  /**
   * Retrieve schema from cache if not expired
   */
  static getSchema(): any | null {
    try {
      const expiry = localStorage.getItem(this.CACHE_EXPIRY_KEY);
      if (!expiry || Number(expiry) < Date.now()) {
        // Cache expired or no expiry set
        return null;
      }

      const schema = localStorage.getItem(this.CACHE_KEY);
      if (!schema) {
        return null;
      }

      return JSON.parse(schema);
    } catch (error) {
      console.warn('Failed to retrieve schema from cache:', error);
      return null;
    }
  }

  /**
   * Check if schema cache exists and is valid
   */
  static hasCachedSchema(): boolean {
    try {
      const expiry = localStorage.getItem(this.CACHE_EXPIRY_KEY);
      return !!expiry && Number(expiry) > Date.now();
    } catch (error) {
      return false;
    }
  }

  /**
   * Clear schema cache
   */
  static clearCache(): void {
    try {
      localStorage.removeItem(this.CACHE_KEY);
      localStorage.removeItem(this.CACHE_EXPIRY_KEY);
    } catch (error) {
      console.warn('Failed to clear schema cache:', error);
    }
  }
}

export default SchemaCache;
