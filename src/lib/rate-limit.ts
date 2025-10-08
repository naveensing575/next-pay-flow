import { RateLimiterMemory } from "rate-limiter-flexible";
import { NextResponse } from "next/server";

const createOrderLimiter = new RateLimiterMemory({
  points: 5, //number of requests
  duration: 60, //time in seconds
});

const verifyPaymentLimiter = new RateLimiterMemory({
  points: 10,
  duration: 60,
});

const webhookLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60,
});

export async function rateLimit(
  identifier: string,
  limiter: RateLimiterMemory
): Promise<NextResponse | null> {
  try {
    await limiter.consume(identifier);
    return null;
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
        }
      }
    );
  }
}

export { createOrderLimiter, verifyPaymentLimiter, webhookLimiter };
