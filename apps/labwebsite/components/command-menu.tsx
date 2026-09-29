"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import {
  Home,
  Compass,
  LayoutGrid,
  Bomb,
  X,
  Grid3X3,
  Boxes,
  Search,
  CornerDownLeft,
} from "lucide-react";
import { useTheme, palette } from "@repo/ui";

const mono: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace",
};

export type CommandItem = {
  id: string;
  group: string;
  title: string;
  desc: string;
  keywords: string;
  href: string;
  external?: boolean;
  icon: React.ReactNode;
};

export function openCommandMenu() {
  window.dispatchEvent(new Event("idk:open-command"));
}

export function CommandMenu({ portalUrl }: { portalUrl: string }) {
  const router = useRouter();
  const { theme } = useTheme();
  const c = palette[theme];
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [cursor, setCursor] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const items: CommandItem[] = React.useMemo(
    () => [
      { id: "home", group: "Pages", title: "Home", desc: "Back to IDK landing", keywords: "home landing index start", href: "/", icon: <Home size={16} /> },
      { id: "portal", group: "Pages", title: "Enter Portal", desc: "Open the workspace directory", keywords: "portal directory hub", href: portalUrl, external: true, icon: <Compass size={16} /> },
      { id: "games", group: "Pages", title: "Games", desc: "Browse all games", keywords: "games arcade play list", href: "/games", icon: <LayoutGrid size={16} /> },
      { id: "minesweeper", group: "Games", title: "Minesweeper", desc: "Clear the minefield", keywords: "minesweeper mines flags bomb classic", href: "/games/minesweeper", icon: <Bomb size={16} /> },
      { id: "tictactoe", group: "Games", title: "Tic-Tac-Toe", desc: "Classic 3×3 duel", keywords: "tic tac toe tictactoe x o noughts crosses", href: "/games/tic-tac-toe", icon: <X size={16} /> },
      { id: "sudoku", group: "Games", title: "Sudoku", desc: "Fill the 9×9 grid", keywords: "sudoku numbers puzzle logic", href: "/games/sudoku", icon: <Grid3X3 size={16} /> },
      { id: "superttt", group: "Games", title: "Super Tic-Tac-Toe", desc: "Ultimate 9-board battle", keywords: "super ultimate meta tictactoe large", href: "/games/super-tic-tac-toe", icon: <Boxes size={16} /> },
    ],
    [portalUrl]
  );

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      `${it.title} ${it.desc} ${it.keywords} ${it.group}`.toLowerCase().includes(q)
    );
  }, [items, query]);

  React.useEffect(() => {
    setCursor(0);
  }, [query]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("idk:open-command", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("idk:open-command", onOpenEvent);
    };
  }, []);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open ]);

  const go = (item: CommandItem) => {
    setOpen(false);
    if (item.external) window.location.href = item.href;
    else router.push(item.href);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((cur) => (results.length ? (cur + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((cur) => (results.length ? (cur - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[cursor];
      if (item) go(item);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            background: "rgba(15,23,42,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "12vh 16px 16px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(560px, 100%)",
              background: c.surface,
              border: `1px solid ${c.border}`,
              borderRadius: 14,
              overflow: "hidden",
              color: c.text,
              boxShadow: "0 24px 70px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 16px",
                borderBottom: `1px solid ${c.borderSoft}`,
              }}
            >
              <Search size={17} style={{ color: c.faint, flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Type a command or search games…"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: c.text,
                  fontSize: 15,
                }}
              />
              <kbd
                style={{
                  fontSize: 10,
                  background: c.pill,
                  color: c.soft,
                  borderRadius: 6,
                  padding: "3px 7px",
                  ...mono,
                }}
              >
                ESC
              </kbd>
            </div>

            <div style={{ maxHeight: 320, overflowY: "auto", padding: 8 }}>
              {results.length === 0 ? (
                <p style={{ fontSize: 13, color: c.faint, textAlign: "center", padding: "20px 0", ...mono }}>
                  No results for “{query}”
                </p>
              ) : (
                results.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => go(item)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      border: "none",
                      borderRadius: 10,
                      cursor: "pointer",
                      textAlign: "left",
                      background: i === cursor ? c.pill : "transparent",
                      color: c.text,
                    }}
                  >
                    <span
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: i === cursor ? c.surface : c.pill,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: c.muted,
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: 14, fontWeight: 600 }}>{item.title}</span>
                      <span style={{ display: "block", fontSize: 12, color: c.soft, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.group} · {item.desc}
                      </span>
                    </span>
                    {i === cursor ? <CornerDownLeft size={14} style={{ color: c.faint, flexShrink: 0 }} /> : null}
                  </button>
                ))
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: 14,
                padding: "10px 16px",
                borderTop: `1px solid ${c.borderSoft}`,
                fontSize: 10,
                color: c.faint,
                ...mono,
              }}
            >
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
