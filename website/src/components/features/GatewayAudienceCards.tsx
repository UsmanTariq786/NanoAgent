"use client";

import { gatewayAudiences } from "@/lib/data";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";

export default function GatewayAudienceCards() {
  return (
    <section className="pt-24" id="why">
      <Container>
        <SectionHeader
          eyebrow="Why teams buy"
          title="Make AI adoption easier to approve."
          description="Gateway gives each stakeholder a clear reason to move forward, without putting developers through another migration."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
          {gatewayAudiences.map((item) => (
            <article
              key={item.label}
              className="h-full p-[28px_24px] border border-[var(--color-border)] bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-bg-2)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-border-2)]"
            >
              <span className="inline-flex mb-[14px] px-[10px] py-[6px] border border-[rgba(243,196,134,0.35)] bg-[rgba(243,196,134,0.12)] text-[#f4c489] text-xs font-bold tracking-[0.08em] uppercase">
                {item.label}
              </span>
              <h3 className="m-0 mb-[10px] text-xl leading-[1.2] tracking-[-0.02em]">
                {item.title}
              </h3>
              <p className="m-0 text-[14.5px] text-[var(--color-text-mut)]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
