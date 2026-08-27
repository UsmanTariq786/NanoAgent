"use client";

import { gatewayFeatures } from "@/lib/data";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";

export default function GatewayFeatureCards() {
  return (
    <section className="pt-[96px] pb-0 featcat gateway-features">
      <Container>
        <div className="flex items-center gap-[14px] mb-[46px]">
          <div className="w-[46px] h-[46px] flex-none grid place-items-center text-[22px] rounded-xl bg-[rgba(124,140,255,0.1)] border border-[var(--color-border)]">★</div>
          <div>
            <h2 className="text-[clamp(28px,4vw,42px)] font-bold tracking-[-0.04em] m-0 mb-3">
              Control the layer that connects developers to models.
            </h2>
            <p className="text-[16px] text-[var(--color-text-mut)] m-0">
              Gateway wraps your existing AI traffic with operational capabilities instead of asking every application team to rebuild them.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-[18px]">
          {gatewayFeatures.map((feature) => (
            <Card
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
