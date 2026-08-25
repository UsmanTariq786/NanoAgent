"use client";

import { ReactNode, useState } from "react";
import Button from "@/components/ui/Button";

interface CTAProps {
  badge?: ReactNode;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  /** When true, the primary button uses a light background (white) instead of the accent color */
  whitePrimary?: boolean;
}

export default function CTA({
  badge,
  title = "Ship with an agent that keeps you in control.",
  description = "Local-first. Reviewable. Open source under Apache-2.0.",
  primaryLabel = "Get NanoAgent",
  primaryHref = "/#get",
  secondaryLabel = "Star on GitHub",
  secondaryHref = "https://github.com/getnanoai/NanoAgent",
  whitePrimary = false,
}: CTAProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          interests: ["voice", "ide", "cli"],
          source: "footer_cta",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to subscribe.");

      setStatus("success");
      try {
        localStorage.setItem("nanoagent_updates_subscribed", "true");
      } catch {}
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to subscribe. Please try again.");
    }
  };

  return (
    <div
      className="relative overflow-hidden text-center
                 border border-[rgba(255,255,255,0.08)] rounded-3xl
                 bg-gradient-to-b from-[rgba(8,10,15,0.98)] to-[rgba(5,7,10,0.98)]
                 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]
                 px-8 py-[70px] max-md:px-5 max-md:py-14"
    >
      {/* Background glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-[-140px] w-[760px] h-[360px]
                   bg-[radial-gradient(closest-side,rgba(124,140,255,0.18),transparent_72%)]
                   blur-[44px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Badge */}
      {badge && (
        <div className="relative z-[1] w-[60px] h-[60px] mx-auto mb-[34px] grid place-items-center border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] shadow-[0_0_0_12px_rgba(255,255,255,0.01)]">
          {badge}
        </div>
      )}

      {/* Title */}
      <h2 className={`relative z-[1] text-[clamp(36px,5vw,58px)] font-bold leading-[1.02] tracking-[-0.05em] m-0 mx-auto mb-4 text-[#f4f7fb] [text-wrap:balance]`}>
        {title}
      </h2>

      {/* Description */}
      <p className="relative z-[1] max-w-[760px] mx-auto mb-[30px] text-[#a0a7b7] text-[17px] leading-[1.6]">
        {description}
      </p>

      {/* Primary Actions */}
      <div className="relative z-[1] flex gap-[14px] justify-center flex-wrap mb-8">
        <Button
          variant={whitePrimary ? "primary" : "primary"}
          size="lg"
          href={primaryHref}
          className={whitePrimary ? "!text-[#05070b] !bg-[#f3f5f8] !shadow-none hover:!bg-white hover:!shadow-none !border-transparent" : ""}
        >
          {primaryLabel}
        </Button>
        <Button variant="ghost" size="lg" href={secondaryHref}>
          {secondaryLabel}
        </Button>
      </div>

      {/* Inline Feature Updates Subscription Box */}
      <div className="relative z-[1] max-w-[460px] mx-auto pt-6 border-t border-[rgba(255,255,255,0.06)]">
        <p className="text-xs font-mono uppercase tracking-wider text-[var(--color-acc-1)] mb-2.5">
          ✨ Want Voice Mode &amp; IDE release notifications?
        </p>

        {status === "success" ? (
          <div className="p-3 rounded-xl bg-[rgba(110,231,255,0.08)] border border-[rgba(110,231,255,0.25)] text-xs text-[var(--color-acc-1)] font-medium">
            🎉 You're on the list! We'll keep you updated on all major releases.
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#050608] border border-[var(--color-border)] text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[var(--color-acc-1)] transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-4 py-2 rounded-xl bg-[var(--color-acc-1)] text-black font-bold text-xs hover:bg-white transition-all shadow-[0_4px_15px_-4px_rgba(110,231,255,0.4)] shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {status === "loading" ? "Subscribing..." : "Notify Me"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-xs text-rose-400 mt-1.5 font-medium">{errorMessage}</p>
        )}

        <p className="text-[11px] text-[var(--color-text-dim)] mt-2">
          Zero spam. Only breaking updates &amp; new platform capabilities.
        </p>
      </div>
    </div>
  );
}
