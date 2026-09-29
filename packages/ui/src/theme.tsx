"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "idk-theme";

const ThemeCtx = React.createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

export function useTheme() {
  return React.useContext(ThemeCtx);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>("light");
  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "dark" || saved === "light") {
        setTheme(saved);
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
      }
    } catch {
      /* ignore */
    }
  }, []);
  React.useEffect(() => {
    try {
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);
  const toggle = React.useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

export const themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){}})();`;

export const palette = {
  light: {
    page: "#f6f6fb",
    surface: "#ffffff",
    surface2: "#f8fafc",
    pill: "#f1f5f9",
    btnSoft: "#eef0f6",
    chrome: "#f1f1f8",
    chrome2: "#f4f4fa",
    border: "rgba(15,23,42,0.08)",
    borderSoft: "rgba(15,23,42,0.06)",
    text: "#0f172a",
    text2: "#334155",
    muted: "#475569",
    soft: "#64748b",
    faint: "#94a3b8",
    faintest: "#cbd5e1",
  },
  dark: {
    page: "#0a0d18",
    surface: "#141b33",
    surface2: "#1b2342",
    pill: "#202a4f",
    btnSoft: "#232c52",
    chrome: "#161d38",
    chrome2: "#1a2140",
    border: "rgba(148,163,184,0.20)",
    borderSoft: "rgba(148,163,184,0.13)",
    text: "#f1f5f9",
    text2: "#cbd5e1",
    muted: "#94a3b8",
    soft: "#8b98b8",
    faint: "#5f6f91",
    faintest: "#3b4763",
  },
} as const;

export type Palette = (typeof palette)["light"];

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        width: 34,
        height: 34,
        borderRadius: 999,
        border: `1px solid ${dark ? "rgba(148,163,184,0.25)" : "rgba(15,23,42,0.10)"}`,
        background: dark ? "#1b2342" : "#f1f5f9",
        color: dark ? "#fbbf24" : "#475569",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
