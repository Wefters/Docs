interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const attemptsMap = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of attemptsMap.entries()) {
      if (now > record.resetAt) {
        attemptsMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetSeconds: number;
}

/**
 * In-memory rate limiter for login brute-force prevention
 * @param ip Client IP address
 * @param limit Maximum attempts allowed within the window
 * @param windowMs Time window in milliseconds (default: 15 minutes)
 */
export function checkRateLimit(
  ip: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000
): RateLimitResult {
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

export function resetRateLimit(ip: string): void {
  attemptsMap.delete(ip);
}
