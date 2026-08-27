"use client";

import { useState, useEffect, useCallback } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

const TOPICS = [
  "Gateway Enterprise",
  "Book a Live Demo",
  "NanoForge Full-Stack Builder",
  "Custom VPC / Self-Hosted",
  "General Inquiry",
];

const TEAM_SIZES = ["1-10 devs", "11-50 devs", "51-200 devs", "200+ devs"];

export default function ContactModal({
  isOpen,
  onClose,
  initialTopic = "Gateway Enterprise",
}: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [teamSize, setTeamSize] = useState(TEAM_SIZES[1]);
  const [topic, setTopic] = useState(initialTopic);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
    }
  }, [initialTopic]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("sales@getnanoai.com");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = "sales@getnanoai.com";
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid work email address.");
      return;
    }
    if (!name.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your name.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          teamSize,
          topic,
          message,
          source: "contact_modal",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setCompany("");
    setMessage("");
    setStatus("idle");
    setErrorMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[rgba(0,0,0,0.65)] backdrop-blur-md transition-all duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div
        className="relative w-full max-w-[540px] max-h-[90vh] overflow-y-auto scrollbar-hide rounded-3xl border border-[rgba(243,196,134,0.30)] bg-[rgba(11,14,20,0.98)] backdrop-blur-2xl p-6 sm:p-8 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85),0_0_30px_rgba(232,166,87,0.1)] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1.5 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(40,200,64,0.15)] border border-[rgba(40,200,64,0.3)] text-[#28c840] flex items-center justify-center mx-auto mb-5">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Request received!</h3>
            <p className="text-[15px] text-[var(--color-text-mut)] max-w-[420px] mx-auto leading-relaxed mb-6">
              Thank you, <strong className="text-white">{name}</strong>. Our enterprise team will follow up with you at <strong className="text-[#f4c489]">{email}</strong> within 24 hours.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.14)] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Close window
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(243,196,134,0.3)] bg-[rgba(243,196,134,0.1)] text-[#f4c489] text-[11px] font-mono font-bold uppercase tracking-wider mb-2.5">
                Enterprise &amp; Sales
              </div>
              <h2 id="contact-modal-title" className="text-[24px] sm:text-[28px] font-extrabold text-white tracking-tight m-0 leading-tight">
                Talk to our team
              </h2>
              <p className="text-xs sm:text-[13.5px] text-[var(--color-text-mut)] mt-1.5 mb-0 leading-relaxed">
                Connect with an engineer to evaluate Gateway spend controls, custom VPC deployment, or book a live demo.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
                    Your Name <span className="text-[#ff5f57]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080d] border border-[var(--color-border)] text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#f4c489] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
                    Work Email <span className="text-[#ff5f57]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080d] border border-[var(--color-border)] text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#f4c489] transition-colors"
                  />
                </div>
              </div>

              {/* Company & Team Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="Acme Technologies"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080d] border border-[var(--color-border)] text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#f4c489] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
                    Team Size
                  </label>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080d] border border-[var(--color-border)] text-white text-xs focus:outline-none focus:border-[#f4c489] transition-colors cursor-pointer"
                  >
                    {TEAM_SIZES.map((size) => (
                      <option key={size} value={size} className="bg-[#0b0e14] text-white">
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Topic Selector */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
                  Primary Interest
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TOPICS.slice(0, 4).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`text-left text-[11.5px] px-3 py-2 rounded-xl border transition-all cursor-pointer truncate ${
                        topic === t
                          ? "border-[#f4c489] bg-[rgba(243,196,134,0.12)] text-[#f4c489] font-semibold shadow-[0_0_15px_-3px_rgba(232,166,87,0.3)]"
                          : "border-[var(--color-border)] bg-[rgba(255,255,255,0.02)] text-[var(--color-text-mut)] hover:border-[var(--color-border-2)]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
                  How can we help? <span className="text-[var(--color-text-dim)] font-normal">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us about your team's models, security requirements, or timeline..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#06080d] border border-[var(--color-border)] text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#f4c489] transition-colors resize-none"
                />
              </div>

              {/* Error Alert */}
              {status === "error" && (
                <div className="p-3 rounded-xl bg-[rgba(255,60,60,0.1)] border border-[rgba(255,60,60,0.25)] text-xs text-[#ff6e6e]">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#f4c489] to-[#e8a657] hover:from-[#ffe0a8] hover:to-[#f4c489] text-black font-bold text-sm tracking-wide transition-all shadow-[0_4px_20px_-5px_rgba(232,166,87,0.5)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Submitting inquiry..." : "Send sales inquiry →"}
              </button>

              {/* Alternative direct email option */}
              <div className="pt-2 text-center text-xs text-[var(--color-text-dim)] flex items-center justify-center gap-1.5">
                <span>Prefer direct email?</span>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="text-[#f4c489] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
                >
                  <span>sales@getnanoai.com</span>
                  {copiedEmail ? (
                    <span className="text-[#28c840] font-mono text-[11px]">✓ Copied!</span>
                  ) : (
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
