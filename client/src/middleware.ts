import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis and Ratelimit
// We use a try-catch pattern or check env vars to avoid crashing build if vars are missing during static generation
let ratelimit: Ratelimit | undefined;

try {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (url && token) {
        const redis = new Redis({
            url: url,
            token: token,
        });

        // Create a new ratelimiter, that allows 20 requests per 1 minute
        ratelimit = new Ratelimit({
            redis: redis,
            limiter: Ratelimit.slidingWindow(20, "1 m"),
            analytics: true,
            prefix: "@upstash/ratelimit",
        });
    }
} catch (e) {
    console.warn("Failed to initialize Upstash Redis for Rate Limiting", e);
}



// In-memory fallback for development/demo (Note: This is per-isolate, not distributed)
const globalStore = globalThis as unknown as { _rateLimitStore?: Map<string, { count: number; reset: number }> };
if (!globalStore._rateLimitStore) {
    globalStore._rateLimitStore = new Map();
}
const inMemoryStore = globalStore._rateLimitStore;

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // 1. Security Headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

    // 2. Rate Limiting (Only for /api routes)
    if (request.nextUrl.pathname.startsWith('/api')) {
        const ip = (request as any).ip ?? request.headers.get('x-forwarded-for') ?? "127.0.0.1";

        let limit = 20;
        let remaining = 20;
        let reset = Date.now() + 60000;
        let success = true;

        if (ratelimit) {
            // Use Redis if available
            try {
                const result = await ratelimit.limit(ip);
                limit = result.limit;
                remaining = result.remaining;
                reset = result.reset;
                success = result.success;
            } catch (e) {
                console.error("Rate limiting failed, allowing request:", e);
            }
        } else {
            // Fallback: In-Memory (Simple fixed window)
            const now = Date.now();
            const windowMs = 60000; // 1 minute
            const record = inMemoryStore.get(ip) || { count: 0, reset: now + windowMs };

            if (now > record.reset) {
                record.count = 0;
                record.reset = now + windowMs;
            }

            record.count += 1;
            inMemoryStore.set(ip, record);

            remaining = Math.max(0, limit - record.count);
            reset = record.reset;
            success = record.count <= limit;

            response.headers.set("X-RateLimit-Fallback", "true");
        }

        response.headers.set("X-RateLimit-Limit", limit.toString());
        response.headers.set("X-RateLimit-Remaining", remaining.toString());
        response.headers.set("X-RateLimit-Reset", reset.toString());

        if (!success) {
            return NextResponse.json(
                { error: "Too many requests" },
                { status: 429, headers: response.headers }
            );
        }
    }

    return response;
}


export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
