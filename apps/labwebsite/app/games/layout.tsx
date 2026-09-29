"use client";

import { CommandMenu } from "../../components/command-menu";

const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:4000";

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CommandMenu portalUrl={portalUrl} />
    </>
  );
}
