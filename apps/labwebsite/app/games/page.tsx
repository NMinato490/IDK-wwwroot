"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bomb, X, Grid3X3, Boxes } from "lucide-react";
import { useTheme, palette, ThemeToggle } from "@repo/ui";

const mono: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace",
};

const GAMES = [
  { href: "/games/minesweeper", icon: <Bomb size={20} />, title: "Minesweeper", desc: "Clear the 9×9 minefield", tag: "classic" },
  { href: "/games/tic-tac-toe", icon: <X size={20} />, title: "Tic-Tac-Toe", desc: "Classic 3×3 duel", tag: "2 players" },
  { href: "/games/sudoku", icon: <Grid3X3 size={20} />, title: "Sudoku", desc: "Fill the 9×9 grid", tag: "logic" },
  { href: "/games/super-tic-tac-toe", icon: <Boxes size={20} />, title: "Super Tic-Tac-Toe", desc: "Ultimate 9-board battle", tag: "strategy" },
];

export default function Page() {
  const { theme } = useTheme();
  const c = palette[theme];
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: c.page, color: c.text }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px" }}>
        <Link href="/" style={{ fontSize: 13, color: c.text2, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <ArrowLeft size={15} /> IDK
        </Link>
        <ThemeToggle />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} style={{ textAlign: "center" }}>
          <p style={{ fontSize: 11, letterSpacing: 2, color: c.faint, ...mono }}>IDK ARCADE</p>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: "8px 0 4px" }}>Games</h1>
          <p style={{ fontSize: 13, color: c.soft, margin: 0 }}>Pick a game — or press ctrl/⌘ K to search</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, width: "min(720px, 100%)", marginTop: 26 }}>
          {GAMES.map((g, i) => (
            <motion.div
              key={g.href}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.08, ease: "easeOut" }}
            >
              <Link
                href={g.href}
                style={{
                  background: c.surface,
                  border: `1px solid ${c.border}`,
                  borderRadius: 14,
                  padding: 20,
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  height: "100%",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ width: 38, height: 38, borderRadius: 10, background: c.pill, display: "inline-flex", alignItems: "center", justifyContent: "center", color: c.muted }}>
                    {g.icon}
                  </span>
                  <span style={{ fontSize: 10, background: c.pill, color: c.soft, borderRadius: 999, padding: "4px 10px", ...mono }}>{g.tag}</span>
                </span>
                <span style={{ fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                  {g.title} <ArrowRight size={15} style={{ color: c.faint }} />
                </span>
                <span style={{ fontSize: 13, color: c.soft }}>{g.desc}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "0 24px 20px", fontSize: 11, color: c.faint, ...mono }}>
        IDK ARCADE · :3000 only
      </div>
    </div>
  );
}
