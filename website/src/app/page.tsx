"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import CTA from "@/components/features/CTA";
import { siteConfig } from "@/lib/data";

type Platform = "terminal" | "vscode" | "vs" | "desktop" | "cicd";

const platformImages: Record<Platform, string> = {
  vscode: "/assets/vscode.png",
  vs: "/assets/vs.png",
  terminal: "/assets/cli.png",
  desktop: "/assets/desktop.png",
  cicd: "/assets/nano.gif",
};

const platformBadge: Record<Platform, string> = {
  vscode: "NanoAgent — VS Code Extension",
  vs: "NanoAgent — Visual Studio 2022+",
  terminal: "nanoai — Local Terminal CLI",
  desktop: "NanoAgent — Native Desktop App",
  cicd: "NanoAgent — CI/CD PR Reviewer",
};

const cliInstallSnippets: Record<string, string> = {
  curl: "curl -fsSL https://raw.githubusercontent.com/getnanoai/NanoAgent/master/scripts/install.sh | bash",
  npm: "npm install -g nanoai-cli",
  pw: "irm https://raw.githubusercontent.com/getnanoai/NanoAgent/master/scripts/install.ps1 | iex",
  pnpm: "pnpm add -g nanoai-cli",
};

export default function HomePage() {
  const [activePlatform, setActivePlatform] = useState<Platform>("terminal");
  const [activeInstallTab, setActiveInstallTab] = useState<string>("curl");
  const [copied, setCopied] = useState(false);
  const visualRef = useRef<HTMLDivElement>(null);

  const currentInstallCmd = cliInstallSnippets[activeInstallTab] || cliInstallSnippets.curl;

  const handleCopy = useCallback(async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = textToCopy;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const targets = document.querySelectorAll(".reveal-target");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* 0. ANNOUNCEMENT BANNER */}
      <aside className="border-b border-[var(--color-border)] bg-[rgba(14,21,30,0.78)] py-2.5 px-4">
        <div className="max-w-[1160px] mx-auto flex items-center justify-center gap-2.5 text-xs sm:text-[13px] text-[var(--color-text-mut)] text-center flex-wrap">
          <span className="px-2 py-0.5 rounded-full border border-[rgba(243,196,134,0.35)] bg-[rgba(243,196,134,0.12)] text-[#f4c489] font-mono font-bold text-[10px] tracking-wider uppercase">
            GATEWAY
          </span>
          <span>One endpoint for every model, with spend controls and audit-ready logs.</span>
          <Link href="/gateway" className="text-[#f4c489] font-semibold hover:underline inline-flex items-center gap-1">
            Explore Gateway for teams →
          </Link>
        </div>
      </aside>

      {/* 1. HERO SECTION */}
      <section className="relative text-center max-w-[1160px] mx-auto px-4 sm:px-6 pt-12 md:pt-20 pb-16 reveal-target">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(110,231,255,0.25)] bg-[rgba(110,231,255,0.06)] text-[var(--color-acc-1)] text-[12px] sm:text-[12.5px] font-mono font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-[var(--color-acc-1)] animate-pulse" />
          Free and open source
        </div>

        <h1 className="text-[clamp(34px,5.8vw,68px)] leading-[1.04] tracking-[-0.04em] font-extrabold m-0 text-[#f3f6fb] [text-wrap:balance]">
          The AI coding agent <br />
          <span className="text-gradient-nano">that asks before it acts.</span>
        </h1>

        <p className="mt-5 mx-auto max-w-[760px] text-[16px] sm:text-[17.5px] leading-[1.65] text-[var(--color-text-mut)] [text-wrap:balance]">
          NanoAgent works locally across your terminal, editor, and desktop. It understands your codebase, proposes a plan, asks before making changes, and lets you review every diff.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/docs#install"
            className="inline-flex items-center justify-center gap-2 font-semibold text-[15px] px-6 py-3 rounded-full text-[#06121a] bg-[var(--color-acc-1)] hover:bg-white transition-all shadow-[0_4px_20px_-5px_rgba(110,231,255,0.5)] cursor-pointer"
          >
            Code for free →
          </Link>
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 font-semibold text-[15px] px-6 py-3 rounded-full border border-[var(--color-border-2)] bg-[rgba(255,255,255,0.03)] text-[var(--color-text)] hover:bg-[rgba(255,255,255,0.08)] transition-all"
          >
            View on GitHub
          </a>
        </div>
        
        <p className="mt-6 text-[13px] text-[var(--color-text-dim)]">
          Apache-2.0 open source · Local-first · macOS, Linux, and Windows
        </p>
      </section>

      {/* 2. INSTALL DEMO BLOCK */}
      <section id="install" className="relative max-w-[1040px] mx-auto px-4 sm:px-6 pb-20 scroll-mt-24 reveal-target">
        <div id="get" className="scroll-mt-24" />
        <div className="text-center mb-10">
          <h2 className="text-[28px] md:text-[36px] font-bold text-white mb-3">Install it. Point it at your repo. Stay in control.</h2>
          <p className="text-[16px] text-[var(--color-text-mut)]">Start in the terminal, then use NanoAgent wherever you already build.</p>
        </div>

        <div className="rounded-3xl border border-[var(--color-border-2)] bg-[rgba(8,10,15,0.95)] p-5 sm:p-8 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.9)] text-left">
          {/* Install Row */}
          <div id="install-commands" className="scroll-mt-24 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
                {(["curl", "npm", "pw", "pnpm"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveInstallTab(tab)}
                    className={`text-xs font-mono font-medium px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      activeInstallTab === tab
                        ? "bg-[rgba(110,231,255,0.2)] text-[var(--color-acc-1)]"
                        : "text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    {tab === "pw" ? "PowerShell" : tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 p-3 px-3.5 rounded-xl border border-[var(--color-border)] bg-[#050608] font-mono text-[12.5px]">
              <div className="flex items-center gap-2 min-w-0 overflow-x-auto scrollbar-hide">
                <span className="text-[var(--color-acc-1)] select-none font-bold">
                  {activeInstallTab === "pw" ? "PS>" : "$"}
                </span>
                <code className="text-[#a6c2e6] whitespace-nowrap">{currentInstallCmd}</code>
              </div>
              <button
                onClick={() => handleCopy(currentInstallCmd)}
                className="shrink-0 px-2.5 py-1 rounded-md border border-[var(--color-border)] bg-[rgba(255,255,255,0.06)] text-[var(--color-text-mut)] text-[11.5px] font-sans font-medium hover:text-[var(--color-text)] hover:bg-[rgba(255,255,255,0.12)] transition-colors cursor-pointer"
              >
                {copied ? <span className="text-[#28c840]">Copied!</span> : <span>Copy</span>}
              </button>
            </div>
          </div>

          {/* Surface Switcher & Window */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-dim)]">
                Surface Preview
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: "terminal", label: "Terminal" },
                    { id: "vscode", label: "VS Code" },
                    { id: "vs", label: "VS 2022" },
                    { id: "desktop", label: "Desktop" },
                    { id: "cicd", label: "CI/CD" },
                  ] as const
                ).map((surf) => (
                  <button
                    key={surf.id}
                    onClick={() => setActivePlatform(surf.id)}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                      activePlatform === surf.id
                        ? "bg-[rgba(124,140,255,0.25)] text-white border border-[rgba(124,140,255,0.4)] shadow-[0_0_15px_-3px_rgba(124,140,255,0.3)]"
                        : "bg-[rgba(255,255,255,0.03)] text-[var(--color-text-mut)] border border-transparent hover:border-[var(--color-border)]"
                    }`}
                  >
                    {surf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Window */}
            <div className="border border-[var(--color-border-2)] rounded-xl bg-[#050505] overflow-hidden shadow-2xl" ref={visualRef}>
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 font-mono text-xs text-[var(--color-text-dim)] truncate">
                  {platformBadge[activePlatform]}
                </span>
              </div>
              <div className="bg-black w-full overflow-hidden">
                <img
                  src={platformImages[activePlatform]}
                  alt={`NanoAgent preview on ${activePlatform}`}
                  className="w-full h-auto max-h-[420px] object-contain object-top block"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Voice Mode & Upcoming Features Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 px-3.5 rounded-xl border border-[rgba(110,231,255,0.15)] bg-[rgba(110,231,255,0.03)] text-xs mt-3">
              <div className="flex items-center gap-2 text-[var(--color-text-mut)]">
                <span className="text-base">🎙️</span>
                <span>Building <strong>Voice Mode</strong> &amp; major IDE engine releases.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("open-updates-modal"));
                  }
                }}
                className="font-semibold text-[var(--color-acc-1)] hover:underline inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                Get Early Updates →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="why" className="py-20 md:py-24 border-t border-[var(--color-border)] relative reveal-target">
        <Container>
          <div className="text-center max-w-[680px] mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(110,231,255,0.25)] bg-[rgba(110,231,255,0.06)] text-[var(--color-acc-1)] text-[12px] font-mono font-semibold uppercase tracking-wider mb-3">
              Built for real codebases
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-[#f3f6fb] m-0 mb-3">
              Powerful enough to help. Transparent enough to trust.
            </h2>
            <p className="text-[16px] text-[var(--color-text-mut)] m-0">
              NanoAgent gives you an AI coding workflow you can inspect, guide, and approve. Without handing your repository to a black box.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-border-2)] flex flex-col">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(110,231,255,0.1)] text-[var(--color-acc-1)] mb-4">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-[#f3f6fb] mb-2">Your code stays local</h3>
              <p className="text-[14px] leading-relaxed text-[var(--color-text-mut)] m-0">Repositories, indexing, and embeddings stay on your machine. Not in a third-party workspace.</p>
            </div>
            {/* Card 2 */}
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-border-2)] flex flex-col">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(110,231,255,0.1)] text-[var(--color-acc-1)] mb-4">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-[#f3f6fb] mb-2">See the plan first</h3>
              <p className="text-[14px] leading-relaxed text-[var(--color-text-mut)] m-0">Review the agent&apos;s reasoning, proposed steps, and intended changes before it starts work.</p>
            </div>
            {/* Card 3 */}
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-border-2)] flex flex-col">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(110,231,255,0.1)] text-[var(--color-acc-1)] mb-4">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-[#f3f6fb] mb-2">Approve meaningful actions</h3>
              <p className="text-[14px] leading-relaxed text-[var(--color-text-mut)] m-0">NanoAgent asks before writing files, running commands, committing code, or taking destructive actions.</p>
            </div>
            {/* Card 4 */}
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-border-2)] flex flex-col">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(110,231,255,0.1)] text-[var(--color-acc-1)] mb-4">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="14" x="2" y="3" rx="2" />
                  <line x1="8" x2="16" y1="21" y2="21" />
                  <line x1="12" x2="12" y1="17" y2="21" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-[#f3f6fb] mb-2">Stay in your workflow</h3>
              <p className="text-[14px] leading-relaxed text-[var(--color-text-mut)] m-0">Use it from the terminal, desktop, VS Code, Visual Studio, or CI review workflow.</p>
            </div>
            {/* Card 5 */}
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-border-2)] flex flex-col">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(110,231,255,0.1)] text-[var(--color-acc-1)] mb-4">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M6 6h10" />
                  <path d="M6 10h10" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-[#f3f6fb] mb-2">Understand the whole codebase</h3>
              <p className="text-[14px] leading-relaxed text-[var(--color-text-mut)] m-0">Semantic, language-aware indexing helps NanoAgent reason across real projects — not just one file.</p>
            </div>
            {/* Card 6 */}
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-border-2)] flex flex-col">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(110,231,255,0.1)] text-[var(--color-acc-1)] mb-4">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 .6.1 1.2.3 1.7C5.7 8.8 4 10.7 4 13c0 2.8 2.2 5 5 5h6c2.8 0 5-2.2 5-5 0-2.3-1.7-4.2-3.8-4.8.2-.5.3-1.1.3-1.7A4.5 4.5 0 0 0 12 2Z" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-[#f3f6fb] mb-2">Keep knowledge in Git</h3>
              <p className="text-[14px] leading-relaxed text-[var(--color-text-mut)] m-0">Share repository memory in version-controlled files your team can read, review, and improve.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. WORKFLOW SECTION */}
      <section id="workflow" className="py-20 md:py-24 border-t border-b border-[var(--color-border)] bg-gradient-to-b from-[rgba(110,231,255,0.02)] to-transparent relative reveal-target">
        <Container>
          <div className="text-center max-w-[680px] mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(110,231,255,0.25)] bg-[rgba(110,231,255,0.06)] text-[var(--color-acc-1)] text-[12px] font-mono font-semibold uppercase tracking-wider mb-3">
              A better agent workflow
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-[#f3f6fb] m-0 mb-3">
              You stay in the loop from prompt to pull request.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)] relative">
              <span className="text-[var(--color-acc-1)] font-mono font-bold text-[13px] block mb-2">01</span>
              <h3 className="text-[18px] font-semibold text-white mb-2">Give NanoAgent the task</h3>
              <p className="text-[14.5px] leading-relaxed text-[var(--color-text-mut)] m-0">
                Ask a question, describe a bug, or define the change you want. NanoAgent gathers relevant repository context.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)] relative">
              <span className="text-[var(--color-acc-1)] font-mono font-bold text-[13px] block mb-2">02</span>
              <h3 className="text-[18px] font-semibold text-white mb-2">Review the plan</h3>
              <p className="text-[14.5px] leading-relaxed text-[var(--color-text-mut)] m-0">
                See what it found, what it intends to change, and what validation it plans to run before execution.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)] relative">
              <span className="text-[var(--color-acc-1)] font-mono font-bold text-[13px] block mb-2">03</span>
              <h3 className="text-[18px] font-semibold text-white mb-2">Approve and review the diff</h3>
              <p className="text-[14.5px] leading-relaxed text-[var(--color-text-mut)] m-0">
                NanoAgent makes approved changes, runs validation, and presents the result for your review.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. GATEWAY PANEL */}
      <section id="gateway" className="pt-[108px] pb-20 reveal-target">
        <Container>
          <div className="rounded-3xl border border-[rgba(243,196,134,0.30)] bg-[radial-gradient(ellipse_at_top,_rgba(232,166,87,0.15),_transparent_80%)] bg-[#050608] overflow-hidden p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(232,166,87,0.15)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(232,166,87,0.3)] bg-[rgba(232,166,87,0.1)] text-[#f4c489] text-[12px] font-mono font-semibold uppercase tracking-wider mb-4">
                  NanoAgent Gateway for teams
                </div>
                <h2 className="text-[32px] md:text-[40px] font-bold text-white mb-4 leading-tight">
                  Start with developers. <br />
                  Add control when your team scales.
                </h2>
                <p className="text-[16px] text-[var(--color-text-mut)] leading-relaxed mb-6">
                  When AI usage expands across a team, NanoAgent Gateway gives you one endpoint for every model. Spend visibility, policies, provider routing (Anthropic, OpenAI, Google, etc.) and more. Plus audit-ready usage records.
                </p>
                <blockquote className="border-l-2 border-[#f4c489] pl-4 text-[15px] italic text-[var(--color-text-dim)] mb-8">
                  NanoAgent helps developers move faster. Gateway helps teams manage that growth without disrupting the tools developers already use.
                </blockquote>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/gateway"
                    className="inline-flex items-center justify-center gap-2 font-semibold text-[14.5px] px-6 py-2.5 rounded-full text-black bg-[#e8a657] hover:bg-[#f4c489] transition-all"
                  >
                    Explore Gateway for teams →
                  </Link>
                  <Link href="/gateway#pricing" className="text-[#f4c489] text-[14.5px] font-semibold hover:underline">
                    View pricing
                  </Link>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-center gap-2 font-mono text-[11px] text-[var(--color-text-dim)] bg-[rgba(255,255,255,0.02)] rounded-xl border border-[rgba(255,255,255,0.05)] p-4">
                  <span className="px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] text-white">NanoAgent</span>
                  <span>→</span>
                  <span className="px-3 py-1.5 rounded-lg border border-[#e8a657] bg-[rgba(232,166,87,0.1)] text-[#f4c489] font-bold shadow-[0_0_15px_-3px_rgba(232,166,87,0.3)]">Gateway</span>
                  <span>→</span>
                  <span className="px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] text-white">Model providers</span>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-[rgba(232,166,87,0.15)] bg-[rgba(232,166,87,0.03)]">
                    <strong className="text-[14px] text-[#f4c489] block mb-1">See spend clearly</strong>
                    <p className="text-[13px] text-[var(--color-text-mut)] m-0">Attribute AI usage by team, project, app, or user.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[rgba(232,166,87,0.15)] bg-[rgba(232,166,87,0.03)]">
                    <strong className="text-[14px] text-[#f4c489] block mb-1">Set guardrails</strong>
                    <p className="text-[13px] text-[var(--color-text-mut)] m-0">Apply access policies, budgets, limits, and audit controls.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[rgba(232,166,87,0.15)] bg-[rgba(232,166,87,0.03)]">
                    <strong className="text-[14px] text-[#f4c489] block mb-1">Route without rewrites</strong>
                    <p className="text-[13px] text-[var(--color-text-mut)] m-0">Manage providers, keys, and fallback models behind one endpoint.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. FORGE STRIP */}
      <section className="pb-20 reveal-target">
        <Container>
          <div className="rounded-2xl border border-[rgba(183,148,246,0.30)] bg-[rgba(176,124,255,0.05)] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_10px_30px_-10px_rgba(176,124,255,0.1)]">
            <div className="flex gap-5">
              <div className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center bg-[#b07cff] text-black text-xl font-bold shadow-[0_0_20px_rgba(176,124,255,0.4)]">
                ▤
              </div>
              <div>
                <span className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[#cbb0ff] block mb-1">Also from Nano</span>
                <h2 className="text-[22px] md:text-[24px] font-bold text-white mb-2 leading-tight">
                  Describe an app. Get a working full-stack build. No code required.
                </h2>
                <p className="text-[15px] text-[var(--color-text-mut)] m-0">
                  NanoForge turns a plain-language product brief into a real, reviewable app: frontend, backend, and database, live in preview.
                </p>
              </div>
            </div>
            <div className="shrink-0 md:ml-4">
              <Link
                href="/nanoforge"
                className="inline-flex items-center justify-center gap-2 font-semibold text-[14.5px] px-6 py-3 rounded-full text-black bg-[#b07cff] hover:bg-white transition-all shadow-[0_4px_15px_-5px_rgba(176,124,255,0.5)] whitespace-nowrap"
              >
                Explore NanoForge →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. OPEN SOURCE CTA */}
      <section className="py-12 reveal-target">
        <Container>
          <div className="max-w-[860px] mx-auto text-center">
            <CTA
              title={"Open source by default.\nBuilt for developers who want control."}
              description="NanoAgent is released under Apache-2.0. Inspect the code, contribute improvements, fork it for your workflow, and build on top of it."
              primaryLabel="View NanoAgent on GitHub"
              primaryHref={siteConfig.github}
              secondaryLabel="Read the Apache-2.0 license"
              secondaryHref={`${siteConfig.github}/blob/master/LICENSE.txt`}
              whitePrimary={true}
            />
          </div>
        </Container>
      </section>

      {/* 8. FINAL CTA */}
      <section className="border-t border-[var(--color-border)] py-[70px] text-center reveal-target">
        <Container>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] text-[var(--color-text-mut)] text-[12px] font-mono font-semibold uppercase tracking-wider mb-4">
            Ready when you are
          </div>
          <h2 className="text-[32px] md:text-[44px] font-bold text-white mb-4 leading-tight">
            Build with an agent <br />
            you can actually inspect.
          </h2>
          <p className="text-[16px] text-[var(--color-text-mut)] max-w-[600px] mx-auto mb-8">
            Install NanoAgent free and use AI across your codebase without giving up visibility, privacy, or control.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/docs#install"
              className="inline-flex items-center justify-center gap-2 font-semibold text-[15px] px-8 py-3.5 rounded-full text-[#06121a] bg-[var(--color-acc-1)] hover:bg-white transition-all shadow-[0_4px_20px_-5px_rgba(110,231,255,0.5)] cursor-pointer"
            >
              Install NanoAgent free →
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center gap-2 font-semibold text-[15px] px-8 py-3.5 rounded-full border border-[var(--color-border-2)] bg-[rgba(255,255,255,0.03)] text-[var(--color-text)] hover:bg-[rgba(255,255,255,0.08)] transition-all"
            >
              Read the docs
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
