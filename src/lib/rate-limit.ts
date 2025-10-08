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
    const limiter = limiters[limitType];
    const { success, reset } = await limiter.limit(identifier);

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": limiter.limit.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }

    return null;
  } catch (error) {
    console.error("Rate limit error:", error);
    return null;
  }
}
