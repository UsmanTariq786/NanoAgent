"use client";

import Container from "@/components/ui/Container";
import { supportedProviders } from "./providerIcons";

export default function GatewayConnectivity() {
  return (
    <section className="py-20 md:py-24 border-t border-[var(--color-border)] relative scroll-mt-20" id="connectivity">
      <Container>
        <div className="text-center max-w-[760px] mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[rgba(232,166,87,0.3)] bg-[rgba(232,166,87,0.1)] text-[#f4c489] text-[12px] font-mono font-semibold uppercase tracking-wider mb-3.5">
            Capabilities
          </div>
          <h2 className="text-[clamp(28px,4.2vw,44px)] font-bold tracking-tight text-[#f3f6fb] m-0 mb-3.5">
            Protect access, route intelligently, and learn from every call.
          </h2>
          <p className="text-[16px] text-[var(--color-text-mut)] leading-relaxed m-0">
            Start with the capabilities you need now. Add deeper control as your AI program matures.
          </p>
        </div>

        {/* 6 Provider Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {supportedProviders.map((provider) => (
            <div
              key={provider.name}
              className="p-5 rounded-2xl border border-[rgba(232,166,87,0.15)] bg-[rgba(10,12,16,0.7)] hover:border-[rgba(232,166,87,0.4)] transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl" aria-hidden="true">{provider.icon}</span>
                    <strong className="text-white text-[15px]">{provider.name}</strong>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[rgba(232,166,87,0.12)] text-[#f4c489] font-semibold">
                    {provider.badge}
                  </span>
                </div>
                <p className="text-[13px] text-[var(--color-text-mut)] font-mono m-0 leading-relaxed">
                  {provider.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 3 Core Routing Architecture Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 sm:p-8 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)]">
          <div>
            <span className="font-mono text-xs font-bold text-[#f4c489] uppercase tracking-wider block mb-1.5">
              01 · Virtual API Keys
            </span>
            <h4 className="text-sm font-semibold text-white mb-1 m-0">Give every client one consistent entry point.</h4>
            <p className="text-xs text-[var(--color-text-mut)] m-0 leading-relaxed">
              Virtual API keys let developers use scoped credentials while provider secrets stay behind your control plane.
            </p>
          </div>
          <div>
            <span className="font-mono text-xs font-bold text-[#f4c489] uppercase tracking-wider block mb-1.5">
              02 · Reliability
            </span>
            <h4 className="text-sm font-semibold text-white mb-1 m-0">Keep applications working when providers change.</h4>
            <p className="text-xs text-[var(--color-text-mut)] m-0 leading-relaxed">
              Configure fallback providers and retry behavior for upstream rate limits, transient errors, and changing model availability.
            </p>
          </div>
          <div>
            <span className="font-mono text-xs font-bold text-[#f4c489] uppercase tracking-wider block mb-1.5">
              03 · Policy Routing
            </span>
            <h4 className="text-sm font-semibold text-white mb-1 m-0">Change the route without pushing application code.</h4>
            <p className="text-xs text-[var(--color-text-mut)] m-0 leading-relaxed">
              Move traffic to a new model release, a cheaper tier, or a private endpoint from the control plane instead of coordinating client updates.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
