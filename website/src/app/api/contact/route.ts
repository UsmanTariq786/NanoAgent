import { NextResponse } from "next/server";

const POSTHOG_HOST = "https://us.i.posthog.com";
const POSTHOG_TOKEN = "phc_zon2mAf4WjnqZCgZszhgbPgieXxngH5iixSiapVGcczQ";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      company = "",
      teamSize = "",
      topic = "General Sales Inquiry",
      message = "",
      source = "contact_modal",
    } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid work email address." },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Please enter your name." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // 1. Capture event in PostHog
    try {
      await fetch(`${POSTHOG_HOST}/capture/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: POSTHOG_TOKEN,
          event: "sales_inquiry_submitted",
          distinct_id: cleanEmail,
          properties: {
            $set: {
              name: cleanName,
              email: cleanEmail,
              company: company.trim(),
              team_size: teamSize,
              last_inquiry_at: new Date().toISOString(),
            },
            name: cleanName,
            email: cleanEmail,
            company: company.trim(),
            team_size: teamSize,
            topic: topic,
            message: message.trim(),
            source: source,
            submitted_at: new Date().toISOString(),
          },
        }),
      });
    } catch (phError) {
      console.error("PostHog telemetry capture error:", phError);
      // Non-blocking: proceed with response
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! We've received your request and our team will get in touch with you shortly.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again or email sales@getnanoai.com directly." },
      { status: 500 }
    );
  }
}
