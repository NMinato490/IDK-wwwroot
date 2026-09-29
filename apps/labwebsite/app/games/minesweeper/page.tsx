"use client";

import * as React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Flag, Bomb, Trophy, Skull } from "lucide-react";
import { useTheme, palette, ThemeToggle } from "@repo/ui";

const mono: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace",
};

const SIZE = 9;
const MINES = 10;

const NUM_COLORS = ["", "#3333ff", "#16a34a", "#e11d48", "#7c3aed", "#ea580c", "#0d9488", "#ec4899", "#64748b"];

type Cell = { mine: boolean; revealed: boolean; flagged: boolean; adj: number };

function emptyGrid(): Cell[] {
  return Array.from({ length: SIZE * SIZE }, () => ({ mine: false, revealed: false, flagged: false, adj: 0 }));
}

function neighbors(i: number): number[] {
  const r = Math.floor(i / SIZE);
  const c = i % SIZE;
  const out: number[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) out.push(nr * SIZE + nc);
    }
  }
  return out;
}

function plantMines(grid: Cell[], safe: number): Cell[] {
  const g = grid.map((cell) => ({ ...cell }));
  let placed = 0;
  while (placed < MINES) {
    const i = Math.floor(Math.random() * SIZE * SIZE);
    if (i === safe || g[i].mine) continue;
    g[i].mine = true;
    placed++;
  }
  for (let i = 0; i < SIZE * SIZE; i++) {
    g[i].adj = neighbors(i).filter((n) => g[n].mine).length;
  }
  return g;
}

export default function Page() {
  const { theme } = useTheme();
  const c = palette[theme];
  const [grid, setGrid] = React.useState<Cell[]>(emptyGrid);
  const [started, setStarted] = React.useState(false);
  const [over, setOver] = React.useState<null | "win" | "lose">(null);
  const [secs, setSecs] = React.useState(0);

  React.useEffect(() => {
    if (!started || over) return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [started, over]);

  const reset = () => {
    setGrid(emptyGrid());
    setStarted(false);
    setOver(null);
    setSecs(0);
  };

  const reveal = (i: number) => {
    if (over) return;
    let g = grid;
    if (!started) {
      g = plantMines(grid, i);
      setStarted(true);
    } else {
      g = grid.map((cell) => ({ ...cell }));
    }
    const cell = g[i];
    if (cell.revealed || cell.flagged) {
      setGrid(g);
      return;
    }
    if (cell.mine) {
      cell.revealed = true;
      g.forEach((cc) => {
        if (cc.mine) cc.revealed = true;
      });
      setGrid(g);
      setOver("lose");
      return;
    }
    const stack = [i];
    while (stack.length) {
      const cur = stack.pop()!;
      const cc = g[cur];
      if (cc.revealed || cc.flagged) continue;
      cc.revealed = true;
      if (cc.adj === 0 && !cc.mine) {
        for (const n of neighbors(cur)) {
          if (!g[n].revealed && !g[n].flagged) stack.push(n);
        }
      }
    }
    const revealedSafe = g.filter((cc) => cc.revealed && !cc.mine).length;
    setGrid(g);
    if (revealedSafe === SIZE * SIZE - MINES) {
      g.forEach((cc) => {
        if (cc.mine) cc.flagged = true;
      });
      setGrid([...g]);
      setOver("win");
    }
  };

  const flag = (e: React.MouseEvent, i: number) => {
    e.preventDefault();
    if (over || !started) return;
    const g = grid.map((cell) => ({ ...cell }));
    if (g[i].revealed) return;
    g[i].flagged = !g[i].flagged;
    setGrid(g);
  };

  const flagsUsed = grid.filter((cc) => cc.flagged).length;

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
          <p style={{ fontSize: 11, letterSpacing: 2, color: c.faint, ...mono }}>IDK ARCADE · MINESWEEPER</p>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: "8px 0 4px" }}>Minesweeper</h1>
          <p style={{ fontSize: 13, color: c.soft, margin: 0 }}>9×9 · 10 mines · right-click to flag</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          style={{ display: "flex", alignItems: "center", gap: 16, margin: "20px 0 14px", fontSize: 14, ...mono }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: c.text2 }}>
            <Bomb size={16} /> {MINES - flagsUsed}
          </span>
          <button
            type="button"
            onClick={reset}
            aria-label="New game"
            style={{ border: `1px solid ${c.border}`, background: c.surface, color: c.text, borderRadius: 999, width: 38, height: 38, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <RotateCcw size={17} />
          </button>
          <span style={{ color: c.text2, minWidth: 56, textAlign: "left" }}>{String(secs).padStart(3, "0")}s</span>
        </motion.div>

        {over ? (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: over === "win" ? "#16a34a" : "#e11d48", margin: "0 0 12px" }}
          >
            {over === "win" ? <Trophy size={17} /> : <Skull size={17} />}
            {over === "win" ? `Cleared in ${secs}s!` : "Boom! Hit a mine."}
          </motion.p>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${SIZE}, 34px)`,
            gap: 3,
            background: c.surface,
            border: `1px solid ${c.border}`,
            borderRadius: 12,
            padding: 10,
          }}
        >
          {grid.map((cell, i) => (
            <button
              key={i}
              type="button"
              onClick={() => reveal(i)}
              onContextMenu={(e) => flag(e, i)}
              aria-label={`cell ${i}`}
              style={{
                width: 34,
                height: 34,
                borderRadius: 6,
                border: "none",
                cursor: over ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 15,
                background: cell.revealed ? (cell.mine ? "rgba(225,29,72,0.15)" : c.surface2) : c.pill,
                color: cell.adj > 0 ? NUM_COLORS[cell.adj] : c.text,
                ...mono,
              }}
            >
              {cell.revealed ? (
                cell.mine ? <Bomb size={16} color="#e11d48" /> : cell.adj > 0 ? cell.adj : ""
              ) : cell.flagged ? (
                <Flag size={15} color="#3333ff" />
              ) : (
                ""
              )}
            </button>
          ))}
        </motion.div>
      </div>

      <div style={{ textAlign: "center", padding: "0 24px 20px", fontSize: 11, color: c.faint, ...mono }}>
        IDK ARCADE · press ctrl/⌘ K for command search
      </div>
    </div>
  );
}
