import { NextResponse } from "next/server";

const POSTHOG_HOST = "https://us.i.posthog.com";
const POSTHOG_TOKEN = "phc_zon2mAf4WjnqZCgZszhgbPgieXxngH5iixSiapVGcczQ";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, interests, source = "website_modal" } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // 1. Capture event in PostHog
    try {
      await fetch(`${POSTHOG_HOST}/capture/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: POSTHOG_TOKEN,
          event: "user_subscribed_updates",
          distinct_id: email.trim().toLowerCase(),
          properties: {
            $set: {
              email: email.trim().toLowerCase(),
              interests: interests || [],
              subscribed_at: new Date().toISOString(),
            },
            email: email.trim().toLowerCase(),
            interests: interests || [],
            source: source,
          },
        }),
      });
    } catch (phError) {
      console.error("PostHog telemetry capture error:", phError);
      // Non-blocking: still return success to user
    }

    return NextResponse.json({
      success: true,
      message: "You're on the list! We will notify you when Voice Mode & major updates drop.",
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
