import { Legalize } from "@legalize-dev/sdk";

// ---------------------------------------------------------------------------
// Client singleton
// ---------------------------------------------------------------------------

let _client: Legalize | null = null;

function getClient(): Legalize | null {
    if (_client) return _client;
    if (!process.env.LEGALIZE_API_KEY) return null;
    _client = new Legalize({ apiKey: process.env.LEGALIZE_API_KEY });
    return _client;
}

// ---------------------------------------------------------------------------
// Monthly rate counter (resets on 1st of each month)
// ---------------------------------------------------------------------------

const MONTHLY_LIMIT = parseInt(process.env.LEGALIZE_MONTHLY_LIMIT ?? "4500", 10);
let _monthlyCount = 0;
let _currentMonth = new Date().getMonth();

function checkRateLimit(): boolean {
    const now = new Date();
    if (now.getMonth() !== _currentMonth) {
        _currentMonth = now.getMonth();
        _monthlyCount = 0;
    }
    if (_monthlyCount >= MONTHLY_LIMIT) {
        console.warn("[legalize] monthly rate limit reached:", _monthlyCount);
        return false;
    }
    return true;
}

function incrementCounter(): void {
    _monthlyCount++;
}

// ---------------------------------------------------------------------------
// In-memory cache (24h TTL)
// ---------------------------------------------------------------------------

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getCached<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return null;
    }
    return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
    cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

/** Invalidate cache entries for a specific law (called from webhook handler). */
export function invalidateLawCache(lawId: string): void {
    for (const key of cache.keys()) {
        if (key.includes(lawId)) cache.delete(key);
    }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface LawSearchHit {
    id: string;
    title: string;
    shortTitle: string | null;
    lawType: string;
}

export interface LawContent {
    id: string;
    title: string;
    contentMd: string;
}

/**
 * Full-text search for Argentine laws. Returns metadata (no content).
 * Respects monthly rate limit. Returns empty on limit breach.
 */
export async function searchLaws(
    query: string,
    options?: { perPage?: number },
): Promise<LawSearchHit[]> {
    const client = getClient();
    if (!client || !checkRateLimit()) return [];

    try {
        incrementCounter();
        const result = await client.laws.search("ar", query, {
            perPage: options?.perPage ?? 5,
        });
        return result.results.map((r) => ({
            id: r.id,
            title: r.title,
            shortTitle: r.short_title ?? null,
            lawType: r.law_type,
        }));
    } catch (err) {
        console.warn("[legalize] search failed:", err);
        return [];
    }
}

/**
 * Fetch full markdown content for a law. Cached for 24h.
 * Respects monthly rate limit. Returns null on limit breach.
 */
export async function getLawContent(lawId: string): Promise<LawContent | null> {
    const cacheKey = `law:ar:${lawId}`;
    const cached = getCached<LawContent>(cacheKey);
    if (cached) return cached;

    const client = getClient();
    if (!client || !checkRateLimit()) return null;

    try {
        incrementCounter();
        const detail = await client.laws.retrieve("ar", lawId);
        const result: LawContent = {
            id: detail.id,
            title: detail.title,
            contentMd: (detail as unknown as { content_md: string }).content_md ?? "",
        };
        setCache(cacheKey, result);
        return result;
    } catch (err) {
        console.warn("[legalize] retrieve failed for", lawId, err);
        return null;
    }
}

/**
 * Check if the Legalize integration is configured (API key present).
 */
export function isLegalizeConfigured(): boolean {
    return !!process.env.LEGALIZE_API_KEY;
}
