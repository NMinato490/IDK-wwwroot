"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Home, LayoutGrid, ArrowLeft, Link2, Globe, Copy, Check, ExternalLink } from "lucide-react";
import { useTheme, palette, ThemeToggle } from "@repo/ui";

const homeUrl = process.env.NEXT_PUBLIC_HOME_URL ?? "http://localhost:3000";
const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:4000";
const displayUrl = process.env.NEXT_PUBLIC_ACCESS_URL ?? "http://localhost:3001";
const displayHost = (() => {
  try {
    return new URL(displayUrl).host;
  } catch {
    return displayUrl;
  }
})();

const mono: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace",
};

export default function Page() {
  const { theme } = useTheme();
  const c = palette[theme];
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(displayUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          `radial-gradient(50% 35% at 30% 15%, rgba(168,85,247,0.10), transparent 60%), radial-gradient(45% 35% at 75% 80%, rgba(59,130,246,0.08), transparent 60%), ${c.page}`,
        color: c.text,
      }}
    >
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              background: "#1e1b4b",
              color: "#fff",
              borderRadius: 6,
              padding: "4px 10px",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1,
              ...mono,
            }}
          >
            IDK
          </span>
          <span style={{ lineHeight: 1.2 }}>
            <span style={{ display: "block", fontSize: 13, fontWeight: 700 }}>IDK Portal</span>
            <span style={{ display: "block", fontSize: 10, letterSpacing: 1, color: c.faint }}>WORKSPACE DIRECTORY</span>
          </span>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
          <a href={portalUrl} style={{ fontSize: 13, color: c.text2, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <ArrowLeft size={15} /> Back to Hub
          </a>
          <ThemeToggle />
        </span>
      </motion.div>

      {/* center */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: 24 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
          style={{ width: "min(480px, 100%)" }}
        >
          <p style={{ fontSize: 12, letterSpacing: 1, color: c.muted, ...mono }}>
            <span style={{ color: "#10b981" }}>•</span> STAGING GATEWAY ONLINE
          </p>
          <h1 style={{ fontSize: 52, fontWeight: 800, letterSpacing: -1, margin: "8px 0" }}>Site 1</h1>
          <p style={{ color: c.muted, fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>
            Sandbox workspace instance at {displayHost} with active ingress routing.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
            style={{
              background: c.surface,
              border: `1px solid ${c.border}`,
              borderRadius: 12,
              padding: 18,
              boxShadow: "0 4px 16px rgba(15,23,42,0.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 12 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
                <Link2 size={15} /> Access URL
              </span>
              <span style={{ color: c.text2 }}>Active</span>
            </div>
            <div
              style={{
                background: c.surface2,
                border: `1px solid ${c.border}`,
                borderRadius: 8,
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                ...mono,
              }}
            >
              <Globe size={15} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayUrl}</span>
              <button
                type="button"
                onClick={copy}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  color: c.text2,
                  ...mono,
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
              </button>
              <a href={displayUrl} style={{ color: c.text2, display: "inline-flex" }} aria-label="Open URL">
                <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            style={{ display: "flex", gap: 10, marginTop: 14 }}
          >
            <a
              href={homeUrl}
              style={{
                background: c.surface,
                border: `1px solid ${c.border}`,
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: 13,
                textDecoration: "none",
                color: c.text,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
              }}
            >
              <Home size={15} /> Home
            </a>
            <a
              href={portalUrl}
              style={{
                background: c.surface,
                border: `1px solid ${c.border}`,
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: 13,
                textDecoration: "none",
                color: c.text,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
              }}
            >
              <LayoutGrid size={15} /> Portal
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        style={{ display: "flex", justifyContent: "space-between", padding: "16px 32px", fontSize: 11, color: c.soft, ...mono }}
      >
        <span>
          IDK Simulator Access Portal <span style={{ color: c.faintest }}>/ v2.4.0</span>
        </span>
        <span>
          <span style={{ color: "#10b981" }}>•</span> Protected by local gateway{" "}
          <span style={{ color: c.faint }}>· :8080 Restricted Access</span>
        </span>
      </motion.div>
    </div>
  );
}
