/**
 * 관리자 로그인 brute-force 방어용 인메모리 rate limiter.
 * 단일 서버 프로세스 기준으로 동작하며, 서버리스/멀티 인스턴스 배포에서는
 * 인스턴스별로 카운트가 분리되므로 Supabase Auth 자체 rate limit과 함께 사용한다.
 */
const WINDOW_MS = 10 * 60 * 1000; // 10분 동안의 시도 횟수를 센다.
const MAX_ATTEMPTS = 5; // 윈도우 내 5회 실패 시 잠금.
const BLOCK_MS = 15 * 60 * 1000; // 15분 잠금.

type Entry = {
  count: number;
  windowStart: number;
  blockedUntil?: number;
};

const attempts = new Map<string, Entry>();

export function checkLoginRateLimit(key: string): { allowed: boolean; retryAfterSeconds?: number } {
  const entry = attempts.get(key);
  if (!entry) return { allowed: true };

  const now = Date.now();
  if (entry.blockedUntil && entry.blockedUntil > now) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.blockedUntil - now) / 1000) };
  }

  if (entry.blockedUntil && entry.blockedUntil <= now) {
    attempts.delete(key);
    return { allowed: true };
  }

  if (now - entry.windowStart > WINDOW_MS) {
    attempts.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordLoginFailure(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    attempts.set(key, { count: 1, windowStart: now });
    return;
  }

  const count = entry.count + 1;
  if (count >= MAX_ATTEMPTS) {
    attempts.set(key, { count, windowStart: entry.windowStart, blockedUntil: now + BLOCK_MS });
    return;
  }

  attempts.set(key, { count, windowStart: entry.windowStart });
}

export function resetLoginAttempts(key: string) {
  attempts.delete(key);
}
