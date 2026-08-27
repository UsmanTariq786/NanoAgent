"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Footer from "./Footer";
import BgEffects from "@/components/ui/BgEffects";
import UpdatesModal from "@/components/features/UpdatesModal";
import ContactModal from "@/components/features/ContactModal";
import { useExitIntent } from "@/lib/useExitIntent";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isDocsTimedOpen, setIsDocsTimedOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactTopic, setContactTopic] = useState("Gateway Enterprise");
  const pathname = usePathname();
  const docsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { isTriggered: isExitTriggered, dismiss: dismissExit } = useExitIntent({
    delayMs: 6000,
    threshold: 15,
  });

  // Timed newsletter popup on /docs after reading for 15 seconds
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (pathname === "/docs" || pathname?.startsWith("/docs")) {
      try {
        const isSubscribed = localStorage.getItem("nanoagent_updates_subscribed") === "true";
        const isDismissed =
          sessionStorage.getItem("nanoagent_modal_auto_shown") === "true" ||
          localStorage.getItem("nanoagent_updates_modal_dismissed");

        if (!isSubscribed && !isDismissed) {
          docsTimerRef.current = setTimeout(() => {
            sessionStorage.setItem("nanoagent_modal_auto_shown", "true");
            setIsDocsTimedOpen(true);
          }, 15000);
        }
      } catch {}
    }

    return () => {
      if (docsTimerRef.current) {
        clearTimeout(docsTimerRef.current);
      }
    };
  }, [pathname]);

  // Listen for explicit manual trigger events from buttons/links
  useEffect(() => {
    const handleManualOpen = () => {
      setIsManualOpen(true);
    };

    window.addEventListener("open-updates-modal", handleManualOpen);
    return () => window.removeEventListener("open-updates-modal", handleManualOpen);
  }, []);

  // Listen for contact modal triggers
  useEffect(() => {
    const handleContactOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ topic?: string }>;
      if (customEvent.detail?.topic) {
        setContactTopic(customEvent.detail.topic);
      }
      setIsContactOpen(true);
    };

    window.addEventListener("open-contact-modal", handleContactOpen);
    return () => window.removeEventListener("open-contact-modal", handleContactOpen);
  }, []);

  const handleClose = () => {
    setIsManualOpen(false);
    setIsDocsTimedOpen(false);
    dismissExit();
  };

  const isModalVisible = isManualOpen || isExitTriggered || isDocsTimedOpen;

  return (
    <>
      <BgEffects />
      <Nav />
      <main>{children}</main>
      <Footer />

      {/* Global Feature Updates Modal */}
      <UpdatesModal
        isOpen={isModalVisible}
        onClose={handleClose}
      />

      {/* Global Sales Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialTopic={contactTopic}
      />
    </>
  );
}
