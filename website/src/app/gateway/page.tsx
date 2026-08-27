"use client";
import { siteConfig } from "@/lib/data";

import GatewayHero from "@/components/features/GatewayHero";
import GatewayAudienceCards from "@/components/features/GatewayAudienceCards";
import GatewayStats from "@/components/features/GatewayStats";
import GatewayFeatureCards from "@/components/features/GatewayFeatureCards";
import GatewayConnectivity from "@/components/features/GatewayConnectivity";
import GatewayPricing from "@/components/features/GatewayPricing";
import Container from "@/components/ui/Container";

export default function GatewayPage() {
  return (
    <>
      <GatewayHero />

      <GatewayAudienceCards />

      <GatewayStats />

      <GatewayFeatureCards />

      <GatewayConnectivity />

      <GatewayPricing />

      {/* ── Adoption Path ── */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center p-10 max-md:p-7 border border-[rgba(232,166,87,0.25)] rounded-3xl bg-gradient-to-br from-[rgba(24,17,9,0.97)] via-[rgba(16,19,23,0.97)] to-[rgba(33,23,8,0.95)]">
            <div>
              <p className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.10em] uppercase text-[#f4c489] mb-4">
                <span className="w-[7px] h-[7px] rounded-full bg-[#f4c489] shadow-[0_0_10px_#f4c489]" />
                A practical adoption path
              </p>
              <h2 className="text-[clamp(28px,4vw,40px)] font-bold tracking-[-0.04em] m-0 mb-4">
                Let usage grow before your plan does.
              </h2>
              <p className="text-[16px] text-[var(--color-text-mut)] mb-6">
                Gateway is designed to support the path from one developer testing a model to multiple teams sharing providers, budgets, and policies.
              </p>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 font-bold text-[14px] px-5 py-3 rounded-full border-transparent text-[#1d1101] bg-gradient-to-r from-[#f2c681] to-[#ffe0a8] hover:-translate-y-0.5 transition-all"
              >
                Start with the free workspace &rarr;
              </a>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { num: "1", title: "Evaluate", desc: "Connect a client and inspect basic request activity in one workspace." },
                { num: "2", title: "Organize", desc: "Add teams, workspaces, usage analytics, and role-based access as adoption spreads." },
                { num: "3", title: "Govern", desc: "Introduce custom limits, audit-grade logging, routing policies, and enterprise support." },
              ].map((step) => (
                <div key={step.num} className="flex items-start gap-3 p-4 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)]">
                  <span className="flex-none w-[30px] h-[30px] flex items-center justify-center rounded-full bg-[#f2c681] text-[#1e1405] font-bold text-[13px]">
                    {step.num}
                  </span>
                  <div>
                    <strong className="block text-[14px] text-white mb-0.5">{step.title}</strong>
                    <span className="text-[13px] text-[var(--color-text-mut)]">{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="pb-0 mt-8">
        <Container>
          <div className="relative overflow-hidden text-center border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(8,10,15,0.98)] to-[rgba(5,7,10,0.98)] px-6 py-[72px] pb-[78px]">
            <div
              className="w-14 h-14 mx-auto mb-6 flex items-center justify-center bg-[rgba(110,231,255,0.1)] rounded-2xl"
              aria-hidden="true"
            >
              <img src="/assets/logo.png" alt="" width="28" height="28" />
            </div>
            <h2 className="text-[clamp(28px,3.6vw,42px)] tracking-[-0.02em] m-0 mb-[10px]">
              Give developers one endpoint. <span style={{color:'#f4c489'}}>Give teams the visibility to say yes.</span>
            </h2>
            <p className="text-[var(--color-text-mut)] text-[16.5px] m-0 mb-6">
              Start with a free Gateway workspace, connect the tools your developers already use, and scale into deeper control when the value is clear.
            </p>
            <div className="flex gap-[14px] justify-center flex-wrap">
              <a
                className="inline-flex items-center justify-center gap-2 font-semibold leading-none rounded-full cursor-pointer transition-all duration-200 whitespace-nowrap text-[15px] px-6 py-[14px] text-[#06121a] bg-[#f4c489] shadow-[0_8px_30px_-10px_rgba(244,196,137,0.6)] hover:bg-[#ffe0a8] hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-10px_rgba(244,196,137,0.7)]"
                href={siteConfig.signupUrl}
              >
                Create free workspace &rarr;
              </a>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 font-semibold leading-none rounded-full cursor-pointer transition-all duration-200 whitespace-nowrap text-[15px] px-6 py-[14px] text-[var(--color-text)] bg-[rgba(255,255,255,0.04)] border-[var(--color-border-2)] border hover:bg-[rgba(255,255,255,0.08)] hover:-translate-y-0.5"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(
                      new CustomEvent("open-contact-modal", {
                        detail: { topic: "Book a Live Demo" },
                      })
                    );
                  }
                }}
              >
                Book a demo
              </button>
            </div>
          </div>
        </Container>
      </section>

      <div className="pb-16" />
    </>
  );
}
