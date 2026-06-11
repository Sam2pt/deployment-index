// Best-effort in-memory rate limiter for the public lead endpoint.
// Netlify Functions keep module-level state per warm instance, so this blunts
// bursts from a single IP and caps total volume per instance. It does NOT
// share state across instances or survive a cold start, so treat it as a first
// line of defence and rely on Resend's own send limits behind it.

type Bucket = { count: number; reset: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  if (b.count >= limit) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((b.reset - now) / 1000)) };
  }

  b.count += 1;

  // Opportunistic cleanup so the map can't grow without bound under load.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (now > v.reset) buckets.delete(k);
  }

  return { ok: true, retryAfter: 0 };
}
