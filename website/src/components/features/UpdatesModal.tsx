"use client";

import { useState, useEffect } from "react";

interface UpdatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
}

const UPDATE_TOPICS = [
  { id: "voice", label: "🎙️ Voice Mode & Audio Agent", default: true },
  { id: "ide", label: "💻 VS Code & Visual Studio Updates", default: true },
  { id: "cli", label: "⚡ CLI Engine & Local LLM Presets", default: true },
  { id: "desktop", label: "🖥️ Native Desktop App Releases", default: false },
];

export default function UpdatesModal({ isOpen, onClose }: UpdatesModalProps) {
  const [email, setEmail] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    UPDATE_TOPICS.filter((t) => t.default).map((t) => t.id)
  );
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
          interests: selectedTopics,
          source: "updates_modal",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe. Please try again.");
      }

      setStatus("success");
      try {
        localStorage.setItem("nanoagent_updates_subscribed", "true");
      } catch (err) {
        console.warn(err);
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[rgba(0,0,0,0.42)] backdrop-blur-[4px] transition-all duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="updates-modal-title"
    >
      <div
        className="relative w-full max-w-[480px] rounded-2xl border border-[rgba(110,231,255,0.25)] bg-[rgba(11,14,22,0.96)] backdrop-blur-xl p-6 sm:p-7 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.75),0_0_30px_rgba(110,231,255,0.1)] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="text-center py-5 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[rgba(110,231,255,0.15)] text-[var(--color-acc-1)] flex items-center justify-center mx-auto text-xl border border-[rgba(110,231,255,0.3)]">
              ✨
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">You're on the list!</h3>
            <p className="text-xs text-[var(--color-text-mut)] max-w-[340px] mx-auto leading-relaxed">
              We'll notify you as soon as Voice Mode and major feature releases drop across your favorite platforms.
            </p>
            <button
              onClick={onClose}
              className="mt-3 px-5 py-2 rounded-xl bg-[var(--color-acc-1)] text-black font-semibold text-xs hover:bg-white transition-colors cursor-pointer"
            >
              Continue Exploring
            </button>
          </div>
        ) : (
          <div>
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[rgba(110,231,255,0.1)] text-[var(--color-acc-1)] border border-[rgba(110,231,255,0.2)] text-[11px] font-mono font-medium mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-acc-1)] animate-pulse" />
              Voice Beta &amp; Major Updates
            </div>

            <h3 id="updates-modal-title" className="text-xl font-bold text-white tracking-tight mb-1.5">
              Stay ahead with NanoAgent
            </h3>

            <p className="text-xs text-[var(--color-text-mut)] mb-4 leading-relaxed">
              Get notified when Voice Mode &amp; major capabilities drop across CLI, VS Code, Visual Studio &amp; Desktop. Zero marketing spam.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Feature Checkboxes */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-dim)]">
                  Select Interests
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {UPDATE_TOPICS.map((topic) => {
                    const isChecked = selectedTopics.includes(topic.id);
                    return (
                      <button
                        type="button"
                        key={topic.id}
                        onClick={() => toggleTopic(topic.id)}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors text-left cursor-pointer ${
                          isChecked
                            ? "bg-[rgba(110,231,255,0.08)] border-[rgba(110,231,255,0.3)] text-white"
                            : "bg-[rgba(255,255,255,0.02)] border-[var(--color-border)] text-[var(--color-text-mut)] hover:border-[var(--color-border-2)]"
                        }`}
                      >
                        <span>{topic.label}</span>
                        <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] ${
                          isChecked
                            ? "bg-[var(--color-acc-1)] border-[var(--color-acc-1)] text-black font-bold"
                            : "border-gray-600 bg-transparent"
                        }`}>
                          {isChecked ? "✓" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="modal-email" className="block text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-dim)] mb-1">
                  Your Developer Email
                </label>
                <input
                  id="modal-email"
                  type="email"
                  required
                  placeholder="name@work.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#050608] border border-[var(--color-border)] text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[var(--color-acc-1)] transition-colors"
                />
              </div>

              {/* Error Display */}
              {status === "error" && (
                <p className="text-xs text-rose-400 font-medium">
                  {errorMessage}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--color-acc-1)] text-black font-bold text-xs hover:bg-white transition-all shadow-[0_4px_20px_-5px_rgba(110,231,255,0.5)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <span className="inline-block w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Notify Me on New Releases →"
                )}
              </button>

              <p className="text-[11px] text-center text-[var(--color-text-dim)] pt-0.5">
                🔒 Only major updates. Unsubscribe anytime in 1 click.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
