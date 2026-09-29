"use client";

import * as React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useTheme, palette, ThemeToggle } from "./theme";

export type NotFoundViewProps = {
  portalHref?: string;
  homeHref?: string;
};

const mono: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace",
};

export function NotFoundView({
  portalHref = "http://localhost:4000",
  homeHref = "http://localhost:3000",
}: NotFoundViewProps) {
  const { theme } = useTheme();
  const c = palette[theme];
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: c.page, color: c.text, ...mono }}>
      {/* mini navbar with theme toggle */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 24px 0" }}>
        <ThemeToggle />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            width: "min(560px, 100%)",
            background: c.surface,
            border: `1px solid ${c.border}`,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(15,23,42,0.08)",
          }}
        >
          {/* window chrome */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              background: c.chrome,
              borderBottom: `1px solid ${c.border}`,
              fontSize: 11,
            }}
          >
            <span style={{ width: 9, height: 9, borderRadius: 999, background: "#f87171" }} />
            <span style={{ width: 9, height: 9, borderRadius: 999, background: "#93c5fd" }} />
            <span style={{ width: 9, height: 9, borderRadius: 999, background: "#cbd5e1" }} />
            <span style={{ marginLeft: 8, color: c.soft, letterSpacing: 1 }}>{"{ }"} response.json</span>
            <span style={{ marginLeft: "auto", color: "#3333ff", fontWeight: 700, letterSpacing: 1 }}>HTTP 404</span>
            <span style={{ color: c.faintest, letterSpacing: 1 }}>UTF-8</span>
          </div>

          {/* json body */}
          <div style={{ padding: "18px 22px", fontSize: 12.5, lineHeight: 1.9 }}>
            <div style={{ color: c.faintest }}>{"// 404: RESOURCE_NOT_FOUND - Target unreachable"}</div>
            <div>{"{"}</div>
            <div style={{ paddingLeft: 16 }}>
              <div><span style={{ color: c.text2 }}>"status"</span>: <span style={{ color: "#3333ff", fontWeight: 700 }}>404</span>,</div>
              <div><span style={{ color: c.text2 }}>"error"</span>: <span style={{ color: "#e11d48" }}>"ERR_ROUTE_NOT_FOUND"</span>,</div>
              <div><span style={{ color: c.text2 }}>"message"</span>: <span style={{ color: c.muted }}>"Gateway route could not resolve target endpoint"</span>,</div>
              <div><span style={{ color: c.text2 }}>"path"</span>: <span style={{ color: "#3333ff" }}>"/void/null_entry"</span>,</div>
              <div><span style={{ color: c.text2 }}>"resolved_cluster"</span>: <span style={{ color: c.muted }}>"edge-zone-01a"</span>,</div>
              <div><span style={{ color: c.text2 }}>"timestamp"</span>: <span style={{ color: c.muted }}>"2025-05-18T10:42:01.402Z"</span></div>
            </div>
            <div>{"}"}</div>
          </div>

          {/* terminal */}
          <div style={{ background: c.chrome2, borderTop: `1px solid ${c.border}`, padding: "12px 22px", fontSize: 12 }}>
            <div style={{ color: c.text2 }}>
              <span style={{ color: "#3333ff" }}>$</span> curl -I https://idk.internal/void/null_entry{" "}
              <span style={{ background: "#c7d2fe" }}>&nbsp;</span>
            </div>
            <div style={{ color: c.faint, marginTop: 6, letterSpacing: 1, fontSize: 11 }}>EXIT CODE: 1</div>
          </div>
        </motion.div>

        {/* actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
          style={{ display: "flex", gap: 10, marginTop: 22 }}
        >
          <a
            href={portalHref}
            style={{
              background: "#2e1bff",
              color: "#fff",
              borderRadius: 8,
              padding: "10px 22px",
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            cd /portal <ArrowRight size={15} />
          </a>
          <a
            href={homeHref}
            style={{
              background: c.btnSoft,
              color: c.text2,
              borderRadius: 8,
              padding: "10px 22px",
              fontSize: 13,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            cd ~ (home)
          </a>
        </motion.div>
      </div>

      {/* footer */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 24px 18px", fontSize: 10, letterSpacing: 1 }}>
        <span>
          <span style={{ color: "#3333ff", fontWeight: 800 }}>IDK</span>
          <span style={{ color: c.faint }}> / v2.4.0&nbsp;&nbsp;PORT: 8080&nbsp;&nbsp;</span>
          <span style={{ color: "#e11d48" }}>STATUS: 404</span>
        </span>
        <span style={{ color: c.soft }}>
          <span style={{ color: "#e11d48" }}>●</span> gateway.proxy.down{" "}
          <span style={{ color: c.faintest }}>(rev 0x9F4)</span>
        </span>
      </div>
    </div>
  );
}
