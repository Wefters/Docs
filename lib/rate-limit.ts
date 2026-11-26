/** Attempts from one IP in the current window. */
/**
 * In-memory rate limiting by IP address, used by the admin login and plugin submissions. Counts reset when
 * the server restarts.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const attemptsMap = new Map<string, RateLimitRecord>();

/** Drops expired records every five minutes. */
if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      const now = Date.now();
      for (const [ip, record] of attemptsMap.entries()) {
        if (now > record.resetAt) {
          attemptsMap.delete(ip);
        }
      }
    },
    5 * 60 * 1000,
  );
}

/** Whether the attempt is allowed, how many remain and when the window resets. */
export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetSeconds: number;
}

/** Records an attempt from `ip` and says whether it is within `limit` attempts per `windowMs`. */
export function checkRateLimit(ip: string, limit: number = 5, windowMs: number = 15 * 60 * 1000): RateLimitResult {
  const now = Date.now();
  const record = attemptsMap.get(ip);

  if (!record || now > record.resetAt) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    attemptsMap.set(ip, newRecord);
    return {
      success: true,
      remaining: limit - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: limit - record.count,
    resetSeconds: Math.ceil((record.resetAt - now) / 1000),
  };
}

/** Forgets the attempts from `ip`, for example after a successful login. */
export function resetRateLimit(ip: string): void {
  attemptsMap.delete(ip);
}
