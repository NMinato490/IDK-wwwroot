"use client";

import * as React from "react";
import { motion } from "motion/react";

export { NotFoundView } from "./not-found-view";
export type { NotFoundViewProps } from "./not-found-view";
export { ThemeProvider, ThemeToggle, useTheme, palette, themeInitScript } from "./theme";
export type { Theme, Palette } from "./theme";

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 24, maxWidth: 960, margin: "0 auto" }}>
      {children}
    </div>
  );
}

export function Card({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 16, marginTop: 16 }}>
      <h3 style={{ margin: "0 0 8px" }}>{title}</h3>
      <p style={{ margin: 0, color: "#555" }}>{body}</p>
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: "#111", color: "#fff", border: "1px solid #111" },
  secondary: { background: "#fff", color: "#111", border: "1px solid #ddd" },
  ghost: { background: "transparent", color: "#111", border: "1px solid transparent" },
  dark: { background: "#2563eb", color: "#fff", border: "1px solid #2563eb" },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: "6px 12px", fontSize: 13, borderRadius: 8 },
  md: { padding: "10px 18px", fontSize: 14, borderRadius: 10 },
  lg: { padding: "14px 24px", fontSize: 16, borderRadius: 12 },
};

export type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: React.CSSProperties;
  onClick?: () => void;
  icon?: React.ReactNode;
};

export function Button({ children, href, variant = "primary", size = "md", style, onClick, icon }: ButtonProps) {
  const merged: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };
  if (href) {
    return (
      <motion.a
        href={href}
        style={merged}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {icon ? <span style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span> : null}
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button
      type="button"
      onClick={onClick}
      style={merged}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {icon ? <span style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span> : null}
      {children}
    </motion.button>
  );
}

// Alias requested as "btn"
export const Btn = Button;

export type NavLink = { label: string; href: string };

export function Navbar({
  brand,
  links = [],
  actions,
}: {
  brand: React.ReactNode;
  links?: NavLink[];
  actions?: React.ReactNode;
}) {
  return (
    <header
      style={{
        borderBottom: "1px solid #eee",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <a
          href="/"
          style={{
            fontWeight: 800,
            textDecoration: "none",
            color: "#111",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {brand}
        </a>
        <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {links.map((l) => (
            <a key={l.href + l.label} href={l.href} style={{ textDecoration: "none", color: "#444", fontSize: 14 }}>
              {l.label}
            </a>
          ))}
        </nav>
        {actions ? <div style={{ display: "flex", gap: 8 }}>{actions}</div> : null}
      </div>
    </header>
  );
}
