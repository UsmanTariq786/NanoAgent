"use client";

import { ReactNode } from "react";
import Layout from "@/components/layout/Layout";
import { PostHogProvider } from "@/components/providers/PostHogProvider";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <PostHogProvider>
      <Layout>{children}</Layout>
    </PostHogProvider>
  );
}

