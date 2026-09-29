"use client";

import { motion } from "motion/react";
import { ArrowRight, Lock } from "lucide-react";
import { useTheme, palette, ThemeToggle } from "@repo/ui";
import { CommandMenu } from "../components/command-menu";

const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:4000";

const mono: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.15 + i * 0.1, ease: "easeOut" as const },
  }),
};

export default function Page() {
  const { theme } = useTheme();
  const c = palette[theme];
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          `radial-gradient(60% 50% at 20% 10%, rgba(51,51,255,0.08), transparent 60%), radial-gradient(50% 40% at 85% 90%, rgba(168,85,247,0.10), transparent 60%), ${c.page}`,
        color: c.text,
      }}
    >
      {/* floating top pill */}
      <div style={{ display: "flex", justifyContent: "center", padding: "20px 16px 0" }}>
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            width: "min(720px, 100%)",
            background: theme === "dark" ? "rgba(20,27,51,0.9)" : "rgba(255,255,255,0.9)",
            border: `1px solid ${c.borderSoft}`,
            borderRadius: 999,
            padding: "8px 8px 8px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 8px 30px rgba(15,23,42,0.08)",
          }}
        >
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <ThemeToggle />
            <motion.a
              href={portalUrl}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: "#3333ff",
                color: "#fff",
                borderRadius: 999,
                padding: "8px 18px",
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                ...mono,
              }}
            >
              Enter Portal <span style={{ fontSize: 12 }}>•</span>
            </motion.a>
          </span>
        </motion.div>
      </div>

      {/* center */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 24,
        }}
      >
        <motion.span
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          style={{
            fontSize: 11,
            letterSpacing: 2,
            color: c.muted,
            background: "rgba(51,51,255,0.06)",
            border: "1px solid rgba(51,51,255,0.12)",
            borderRadius: 999,
            padding: "6px 14px",
            ...mono,
          }}
        >
          <span style={{ color: "#3333ff" }}>•</span> WELCOME TO IDK WORKSPACE
        </motion.span>
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          style={{ fontSize: "clamp(72px, 12vw, 120px)", fontWeight: 900, letterSpacing: -4, margin: "16px 0 8px", lineHeight: 1 }}
        >
          IDK
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          style={{ color: c.soft, fontSize: 17, lineHeight: 1.6, maxWidth: 460, margin: 0 }}
        >
          Your unified minimal workspace gateway. Access all interconnected modules, telemetry, and tools from one
          seamless portal.
        </motion.p>
        <motion.a
          href={portalUrl}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.45, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            marginTop: 24,
            background: "#2e1bff",
            color: "#fff",
            borderRadius: 999,
            padding: "12px 28px",
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 12px 30px rgba(46,27,255,0.35)",
            ...mono,
          }}
        >
          Enter Portal <ArrowRight size={16} />
        </motion.a>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          style={{ marginTop: 16, fontSize: 11, letterSpacing: 2, color: c.faint, display: "inline-flex", alignItems: "center", gap: 6, ...mono }}
        >
          <Lock size={12} /> Encrypted gateway session active
        </motion.p>
      </div>

      {/* bottom status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px 20px",
          fontSize: 11,
          letterSpacing: 1,
          color: c.faint,
          ...mono,
        }}
      >
        <span>
          <span style={{ color: c.text, fontWeight: 700 }}>IDK</span> / v2.4.0 · rev 0x9F4
        </span>
        <span>
          <span style={{ color: "#3333ff" }}>●</span> Protected by local gateway{" "}
          <span style={{ color: c.faintest }}> :8088</span>
        </span>
      </motion.div>

      <CommandMenu portalUrl={portalUrl} />
    </div>
  );
}
