import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const createOrderLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: true,
  prefix: "@ratelimit/createOrder",
});

const verifyPaymentLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
  prefix: "@ratelimit/verifyPayment",
});

const webhookLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "60 s"),
  analytics: true,
  prefix: "@ratelimit/webhook",
});

const limiters = {
  createOrder: createOrderLimiter,
  verifyPayment: verifyPaymentLimiter,
  webhook: webhookLimiter,
};

export async function rateLimit(
  identifier: string,
  limitType: keyof typeof limiters
): Promise<NextResponse | null> {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.warn("Upstash Redis credentials not configured. Rate limiting disabled.");
      return null;
    }

    const limiter = limiters[limitType];
    const { success, limit, remaining, reset } = await limiter.limit(identifier);

    console.log(`[Rate Limit] ${limitType} - Identifier: ${identifier} - Success: ${success} - Remaining: ${remaining}/${limit}`);

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      console.warn(`[Rate Limit] BLOCKED - ${limitType} - Identifier: ${identifier} - Retry after: ${retryAfter}s`);

      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }

    return null;
  } catch (error) {
    console.error(`[Rate Limit] ERROR in ${limitType}:`, error);
    // On error, allow the request to proceed (fail open)
    return null;
  }
}
