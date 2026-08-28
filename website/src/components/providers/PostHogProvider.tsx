"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

function PostHogPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && typeof window !== "undefined") {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const posthogKey =
      process.env.NEXT_PUBLIC_POSTHOG_KEY ||
      "phc_zon2mAf4WjnqZCgZszhgbPgieXxngH5iixSiapVGcczQ";
    const posthogHost =
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    if (typeof window !== "undefined" && !posthog.__loaded) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        capture_pageview: false, // Handled dynamically via PostHogPageViewTracker for Next.js App Router
        capture_pageleave: true,  // Automatically tracks when users leave / bounce
        autocapture: true,        // Tracks clicks, scrolls, rage-clicks, and form interactions
        disable_session_recording: false,
        session_recording: {
          maskAllInputs: false,
          maskInputOptions: {
            password: true,
          },
        },
        loaded: (ph) => {
          if (process.env.NODE_ENV === "development") {
            // ph.debug();
          }
        },
      });
    }
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageViewTracker />
      </Suspense>
      {children}
    </>
  );
}

export { posthog };
