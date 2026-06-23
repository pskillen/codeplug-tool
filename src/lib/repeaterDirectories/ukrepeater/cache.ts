const CACHE_PREFIX = 'etcc-api:';
const DEFAULT_TTL_MS = 15 * 60 * 1000;

interface CacheEntry {
  body: string;
  expiresAt: number;
}

function cacheKey(url: string): string {
  return `${CACHE_PREFIX}${url}`;
}

export function readCachedResponse(url: string): string | null {
  try {
    const raw = sessionStorage.getItem(cacheKey(url));
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() > entry.expiresAt) {
      sessionStorage.removeItem(cacheKey(url));
      return null;
    }
    return entry.body;
  } catch {
    return null;
  }
}

export function writeCachedResponse(url: string, body: string, ttlMs = DEFAULT_TTL_MS): void {
  try {
    const entry: CacheEntry = { body, expiresAt: Date.now() + ttlMs };
    sessionStorage.setItem(cacheKey(url), JSON.stringify(entry));
  } catch {
    // sessionStorage full or unavailable — ignore
  }
}

export function clearEtccCache(): void {
  try {
    const keys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(CACHE_PREFIX)) keys.push(key);
    }
    for (const key of keys) sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}
