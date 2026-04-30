type CacheEntry<T> = {
  value: T;
  expiresAtMs: number;
};

export type ResponseCacheOptions = {
  maxEntries: number;
  defaultTtlMs: number;
};

/**
 * Simple in-memory LRU with TTL for connector responses.
 */
export class ResponseCache<TValue> {
  private readonly maxEntries: number;
  private readonly defaultTtlMs: number;
  private readonly map = new Map<string, CacheEntry<TValue>>();

  constructor(options: ResponseCacheOptions) {
    this.maxEntries = options.maxEntries;
    this.defaultTtlMs = options.defaultTtlMs;
  }

  get(key: string): TValue | undefined {
    const entry = this.map.get(key);
    if (!entry) {
      return undefined;
    }
    if (Date.now() > entry.expiresAtMs) {
      this.map.delete(key);
      return undefined;
    }
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.value;
  }

  set(key: string, value: TValue, ttlMs?: number): void {
    if (this.map.size >= this.maxEntries && !this.map.has(key)) {
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) {
        this.map.delete(oldestKey);
      }
    }
    const ttl = ttlMs ?? this.defaultTtlMs;
    this.map.set(key, { value, expiresAtMs: Date.now() + ttl });
  }

  makeKey(parts: readonly string[]): string {
    return parts.join("::");
  }
}
