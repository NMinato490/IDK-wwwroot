"use client";

import * as React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useTheme, palette, ThemeToggle } from "@repo/ui";

const mono: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace",
};

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function winnerOf(b: (string | null)[]): string | null {
  for (const [a, c, d] of LINES) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  }
  return null;
}

function minimax(b: (string | null)[], isMax: boolean): number {
  const w = winnerOf(b);
  if (w === "O") return 10;
  if (w === "X") return -10;
  if (b.every(Boolean)) return 0;
  let best = isMax ? -Infinity : Infinity;
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue;
    b[i] = isMax ? "O" : "X";
    const s = minimax(b, !isMax);
    b[i] = null;
    best = isMax ? Math.max(best, s) : Math.min(best, s);
  }
  return best;
}

function cpuPick(b: (string | null)[], level: "easy" | "hard"): number {
  const empty = b.map((v, i) => (v ? null : i)).filter((v) => v !== null) as number[];
  if (level === "easy" || empty.length === 9) return empty[Math.floor(Math.random() * empty.length)];
  // Hard: win if possible, block if needed, else minimax
  for (const i of empty) {
    const t = [...b];
    t[i] = "O";
    if (winnerOf(t) === "O") return i;
  }
  for (const i of empty) {
    const t = [...b];
    t[i] = "X";
    if (winnerOf(t) === "X") return i;
  }
  let bestScore = -Infinity;
  let best = empty[0];
  for (const i of empty) {
    const t = [...b];
    t[i] = "O";
    const s = minimax(t, false);
    if (s > bestScore) {
      bestScore = s;
      best = i;
    }
  }
  return best;
}

export default function Page() {
  const { theme } = useTheme();
  const c = palette[theme];
  const [board, setBoard] = React.useState<(string | null)[]>(Array(9).fill(null));
  const [turn, setTurn] = React.useState<"X" | "O">("X");
  const [score, setScore] = React.useState({ X: 0, O: 0, draws: 0 });
  const [mode, setMode] = React.useState<"2p" | "cpu">("cpu");
  const [level, setLevel] = React.useState<"easy" | "hard">("hard");

  const winner = winnerOf(board);
  const draw = !winner && board.every(Boolean);

  const applyMove = (b: (string | null)[], i: number, player: "X" | "O") => {
    b[i] = player;
    setBoard(b);
    const w = winnerOf(b);
    if (w) setScore((s) => ({ ...s, [w]: s[w as "X" | "O"] + 1 }));
    else if (b.every(Boolean)) setScore((s) => ({ ...s, draws: s.draws + 1 }));
    else setTurn(player === "X" ? "O" : "X");
  };

  const play = (i: number) => {
    if (board[i] || winner) return;
    if (mode === "cpu" && turn !== "X") return;
    applyMove([...board], i, turn);
  };

  React.useEffect(() => {
    if (mode !== "cpu" || turn !== "O" || winner || draw) return;
    const t = setTimeout(() => {
      applyMove([...board], cpuPick(board, level), "O");
    }, 500);
    return () => clearTimeout(t);
  });

  const switchMode = (m: "2p" | "cpu") => {
    setMode(m);
    setBoard(Array(9).fill(null));
    setTurn("X");
    setScore({ X: 0, O: 0, draws: 0 });
  };

  const nextRound = () => {
    setBoard(Array(9).fill(null));
    setTurn(winner === "X" ? "O" : winner === "O" ? "X" : turn);
  };

  const resetAll = () => {
    setBoard(Array(9).fill(null));
    setTurn("X");
    setScore({ X: 0, O: 0, draws: 0 });
  };

  const status = winner
    ? mode === "cpu"
      ? winner === "X"
        ? "You win!"
        : "CPU wins!"
      : `${winner} wins!`
    : draw
      ? "Draw!"
      : mode === "cpu"
        ? turn === "O"
          ? "CPU thinking…"
          : "Your move (X)"
        : `${turn} to move`;

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
          <p style={{ fontSize: 11, letterSpacing: 2, color: c.faint, ...mono }}>IDK ARCADE · TIC-TAC-TOE</p>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: "8px 0 4px" }}>Tic-Tac-Toe</h1>
          <p style={{ fontSize: 14, fontWeight: 700, color: winner ? "#16a34a" : c.text2, margin: 0, ...mono }}>{status}</p>
          <div style={{ display: "flex", gap: 6, marginTop: 14, justifyContent: "center", ...mono }}>
            {(["2p", "cpu"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                style={{
                  background: mode === m ? "#2e1bff" : c.pill,
                  color: mode === m ? "#fff" : c.text2,
                  border: "none",
                  borderRadius: 999,
                  padding: "8px 18px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  ...mono,
                }}
              >
                {m === "2p" ? "2 Players" : "vs CPU"}
              </button>
            ))}
          </div>
          {mode === "cpu" ? (
            <div style={{ display: "flex", gap: 6, marginTop: 8, justifyContent: "center", ...mono }}>
              {(["easy", "hard"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    setLevel(l);
                    setBoard(Array(9).fill(null));
                    setTurn("X");
                  }}
                  style={{
                    background: level === l ? c.text : "transparent",
                    color: level === l ? c.page : c.soft,
                    border: `1px solid ${c.border}`,
                    borderRadius: 999,
                    padding: "6px 14px",
                    fontSize: 11,
                    cursor: "pointer",
                    ...mono,
                  }}
                >
                  {l === "easy" ? "Easy" : "Hard"}
                </button>
              ))}
            </div>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 92px)", gap: 8, marginTop: 22 }}
        >
          {board.map((v, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => play(i)}
              whileHover={!v && !winner ? { scale: 1.04 } : undefined}
              whileTap={!v && !winner ? { scale: 0.96 } : undefined}
              aria-label={`square ${i}`}
              style={{
                width: 92,
                height: 92,
                borderRadius: 14,
                border: `1px solid ${c.border}`,
                background: c.surface,
                color: v === "X" ? "#3333ff" : "#e11d48",
                fontSize: 44,
                fontWeight: 900,
                cursor: v || winner ? "default" : "pointer",
              }}
            >
              {v}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
          style={{ display: "flex", gap: 10, marginTop: 22, fontSize: 13, ...mono }}
        >
          <span style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 8, padding: "8px 14px", color: c.text2 }}>
            {mode === "cpu" ? "You" : "X"} · {score.X}
          </span>
          <span style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 8, padding: "8px 14px", color: c.text2 }}>
            {mode === "cpu" ? "CPU" : "O"} · {score.O}
          </span>
          <span style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 8, padding: "8px 14px", color: c.text2 }}>
            draws · {score.draws}
          </span>
        </motion.div>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button
            type="button"
            onClick={nextRound}
            style={{ background: "#2e1bff", color: "#fff", border: "none", borderRadius: 999, padding: "10px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", ...mono }}
          >
            Next round
          </button>
          <button
            type="button"
            onClick={resetAll}
            style={{ background: c.pill, color: c.text2, border: "none", borderRadius: 999, padding: "10px 18px", fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, ...mono }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "0 24px 20px", fontSize: 11, color: c.faint, ...mono }}>
        IDK ARCADE · press ctrl/⌘ K for command search
      </div>
    </div>
  );
}
