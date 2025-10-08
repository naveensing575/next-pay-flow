import { RateLimiterMemory } from "rate-limiter-flexible";
import { NextResponse } from "next/server";

// Create rate limiters for different endpoints
const createOrderLimiter = new RateLimiterMemory({
  points: 5, // Number of requests
  duration: 60, // Per 60 seconds (1 minute)
});

const verifyPaymentLimiter = new RateLimiterMemory({
  points: 10, // Number of requests
  duration: 60, // Per 60 seconds
});

const webhookLimiter = new RateLimiterMemory({
  points: 100, // Higher limit for webhooks from Razorpay
  duration: 60, // Per 60 seconds
});

// Rate limit by identifier (user ID or IP)
export async function rateLimit(
  identifier: string,
  limiter: RateLimiterMemory
) {
  try {
    await limiter.consume(identifier);
    return null;
  } catch (error) {
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
