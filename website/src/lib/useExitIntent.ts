"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface UseExitIntentOptions {
  threshold?: number;
  delayMs?: number;
  storageKey?: string;
  cooldownDays?: number;
}

export function useExitIntent({
  threshold = 15,
  delayMs = 4000,
  storageKey = "nanoagent_updates_modal_dismissed",
  cooldownDays = 14,
}: UseExitIntentOptions = {}) {
  const [isTriggered, setIsTriggered] = useState(false);
  const hasTriggeredRef = useRef(false);

  // Check if auto-trigger is suppressed
  const checkSuppressed = useCallback(() => {
    if (typeof window === "undefined") return true;
    try {
      // 1. If already subscribed
      if (localStorage.getItem("nanoagent_updates_subscribed") === "true") {
        return true;
      }
      // 2. If already shown or dismissed in this browser session
      if (sessionStorage.getItem("nanoagent_modal_auto_shown") === "true") {
        return true;
      }
      // 3. If dismissed within cooldown days
      const dismissed = localStorage.getItem(storageKey);
      if (dismissed) {
        const timestamp = parseInt(dismissed, 10);
        const cooldownMs = cooldownDays * 24 * 60 * 60 * 1000;
        if (Date.now() - timestamp < cooldownMs) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }, [storageKey, cooldownDays]);

  const dismiss = useCallback(() => {
    setIsTriggered(false);
    hasTriggeredRef.current = true;
    try {
      sessionStorage.setItem("nanoagent_modal_auto_shown", "true");
      localStorage.setItem(storageKey, Date.now().toString());
    } catch (e) {
      console.warn("Could not save dismissal state", e);
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (checkSuppressed()) return;

    let isEligible = false;
    const timer = setTimeout(() => {
      isEligible = true;
    }, delayMs);

    const handleMouseLeave = (e: MouseEvent) => {
      // If mouse leaves through top boundary (towards tabs / close button)
      if (
        isEligible &&
        !hasTriggeredRef.current &&
        !checkSuppressed() &&
        e.clientY <= threshold
      ) {
        hasTriggeredRef.current = true;
        try {
          sessionStorage.setItem("nanoagent_modal_auto_shown", "true");
        } catch {}
        setIsTriggered(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [threshold, delayMs, checkSuppressed]);

  return {
    isTriggered,
    dismiss,
  };
}
