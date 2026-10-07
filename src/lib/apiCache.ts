// ============================================================
// Sectors API Response Cache — 5-minute TTL
// ============================================================
// Prevents redundant API calls that waste credits.
// Clears on tab close (in-memory only — appropriate for
// a client-side app with no backend).
// ============================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const TTL_MS = 5 * 60 * 1000; // 5 minutes

function cacheKey(fnName: string, args: unknown[]): string {
  return `${fnName}:${JSON.stringify(args)}`;
}

export function getCached<T>(fnName: string, args: unknown[]): T | null {
  const key = cacheKey(fnName, args);
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCache<T>(fnName: string, args: unknown[], data: T): void {
  const key = cacheKey(fnName, args);
  cache.set(key, { data, timestamp: Date.now() });
}

export function clearCache(): void {
  cache.clear();
}

/** Wraps an async Sectors API function with caching */
export async function withCache<T>(
  fnName: string,
  args: unknown[],
  fetchFn: () => Promise<T>
): Promise<T> {
  const cached = getCached<T>(fnName, args);
  if (cached !== null) return cached;
  const result = await fetchFn();
  setCache(fnName, args, result);
  return result;
}
