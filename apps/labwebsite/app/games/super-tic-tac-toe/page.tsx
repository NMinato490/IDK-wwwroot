"use client";

import * as React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react";
import { useTheme, palette, ThemeToggle } from "@repo/ui";

const mono: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace",
};

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

type Mark = "X" | "O" | null;

function lineWinner(cells: Mark[]): Mark {
  for (const [a, b, d] of LINES) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[d]) return cells[a];
  }
  return null;
}

function legalCells(boards: Mark[][], decided: (Mark | "D")[], active: number | null): [number, number][] {
  const bs = active !== null && !decided[active]
    ? [active]
    : decided.map((d, bi) => (d ? null : bi)).filter((v) => v !== null) as number[];
  const out: [number, number][] = [];
  for (const b of bs) {
    boards[b].forEach((v, i) => {
      if (!v) out.push([b, i]);
    });
  }
  return out;
}

// Heuristic CPU: win meta > block meta > win board > block board > positional
function cpuMove(boards: Mark[][], decided: (Mark | "D")[], active: number | null): [number, number] {
  const cells = legalCells(boards, decided, active);
  const decideAfter = (b: number, i: number, p: "X" | "O"): (Mark | "D")[] => {
    const t = [...boards[b]];
    t[i] = p;
    const w = lineWinner(t);
    if (w) {
      const nd = [...decided];
      nd[b] = w;
      return nd;
    }
    if (t.every(Boolean)) {
      const nd = [...decided];
      nd[b] = "D";
      return nd;
    }
    return decided;
  };
  const metaOf = (nd: (Mark | "D")[]) => lineWinner(nd.map((d) => (d === "D" ? null : d)));
  // 1. CPU wins meta
  for (const [b, i] of cells) {
    if (metaOf(decideAfter(b, i, "O")) === "O") return [b, i];
  }
  // 2. Block player meta win
  for (const [b, i] of cells) {
    if (metaOf(decideAfter(b, i, "X")) === "X") return [b, i];
  }
  // 3. Win a sub-board
  for (const [b, i] of cells) {
    const t = [...boards[b]];
    t[i] = "O";
    if (lineWinner(t) === "O") return [b, i];
  }
  // 4. Block sub-board loss
  for (const [b, i] of cells) {
    const t = [...boards[b]];
    t[i] = "X";
    if (lineWinner(t) === "X") return [b, i];
  }
  // 5. Positional: center board/cells first, then corners
  const score = ([b, i]: [number, number]) => {
    let s = Math.random() * 2;
    if (b === 4) s += 3;
    if (i === 4) s += 4;
    else if (i === 0 || i === 2 || i === 6 || i === 8) s += 2;
    if (b === 0 || b === 2 || b === 6 || b === 8) s += 1;
    return s;
  };
  return cells.sort((a, b2) => score(b2) - score(a))[0];
}

export default function Page() {
  const { theme } = useTheme();
  const c = palette[theme];
  const [boards, setBoards] = React.useState<Mark[][]>(() => Array.from({ length: 9 }, () => Array(9).fill(null)));
  const [decided, setDecided] = React.useState<(Mark | "D")[]>(() => Array(9).fill(null));
  const [active, setActive] = React.useState<number | null>(null);
  const [turn, setTurn] = React.useState<"X" | "O">("X");
  const [mode, setMode] = React.useState<"2p" | "cpu">("cpu");
  const [tally, setTally] = React.useState({ X: 0, O: 0, draws: 0 });

  const metaWinner = lineWinner(decided.map((d) => (d === "D" ? null : d)));
  const metaDraw = !metaWinner && decided.every(Boolean);

  const doMove = (b: number, i: number, player: "X" | "O") => {
    const nb = boards.map((row) => [...row]);
    nb[b][i] = player;
    const nd = [...decided];
    const w = lineWinner(nb[b]);
    if (w) nd[b] = w;
    else if (nb[b].every(Boolean)) nd[b] = "D";
    setBoards(nb);
    setDecided(nd);
    setActive(nd[i] ? null : i);
    setTurn(player === "X" ? "O" : "X");
    const mw = lineWinner(nd.map((d) => (d === "D" ? null : d)));
    if (mw) setTally((t) => ({ ...t, [mw]: t[mw as "X" | "O"] + 1 }));
    else if (nd.every(Boolean)) setTally((t) => ({ ...t, draws: t.draws + 1 }));
  };

  const play = (b: number, i: number) => {
    if (metaWinner || decided[b] || boards[b][i]) return;
    if (active !== null && active !== b) return;
    if (mode === "cpu" && turn !== "X") return;
    doMove(b, i, turn);
  };

  React.useEffect(() => {
    if (mode !== "cpu" || turn !== "O" || metaWinner || metaDraw) return;
    const t = setTimeout(() => {
      const mv = cpuMove(boards, decided, active);
      if (mv) doMove(mv[0], mv[1], "O");
    }, 550);
    return () => clearTimeout(t);
  });

  const reset = (freshTally = false) => {
    setBoards(Array.from({ length: 9 }, () => Array(9).fill(null)));
    setDecided(Array(9).fill(null));
    setActive(null);
    setTurn("X");
    if (freshTally) setTally({ X: 0, O: 0, draws: 0 });
  };

  const switchMode = (m: "2p" | "cpu") => {
    setMode(m);
    reset(true);
  };

  const status = metaWinner
    ? mode === "cpu"
      ? metaWinner === "X"
        ? "You take the meta!"
        : "CPU takes the meta!"
      : `${metaWinner} wins the meta board!`
    : metaDraw
      ? "Meta draw!"
      : mode === "cpu" && turn === "O"
        ? "CPU thinking…"
        : active === null
          ? `${mode === "cpu" ? "Your" : `${turn}'s`} move · free choice`
          : `${mode === "cpu" ? "Your" : `${turn}'s`} move · must play board ${active + 1}`;

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
          <p style={{ fontSize: 11, letterSpacing: 2, color: c.faint, ...mono }}>IDK ARCADE · SUPER TIC-TAC-TOE</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "8px 0 4px" }}>Super Tic-Tac-Toe</h1>
          <p style={{ fontSize: 13, color: c.soft, margin: 0, ...mono }}>{status}</p>
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
          <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "center", fontSize: 12, ...mono }}>
            <span style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 8, padding: "6px 12px", color: c.text2 }}>
              {mode === "cpu" ? "You" : "X"} · {tally.X}
            </span>
            <span style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 8, padding: "6px 12px", color: c.text2 }}>
              {mode === "cpu" ? "CPU" : "O"} · {tally.O}
            </span>
            <span style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 8, padding: "6px 12px", color: c.text2 }}>
              draws · {tally.draws}
            </span>
          </div>
        </motion.div>

        {metaWinner ? (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#16a34a", margin: "12px 0 0" }}
          >
            <Trophy size={17} /> {metaWinner} conquers the grid!
          </motion.p>
        ) : null}

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: 10, marginTop: 20 }}
        >
          {boards.map((cells, b) => {
            const isActive = !metaWinner && !decided[b] && (active === null || active === b);
            const won = decided[b] && decided[b] !== "D" ? decided[b] : null;
            return (
              <div
                key={b}
                style={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 34px)",
                  gap: 3,
                  background: c.surface,
                  border: `2px solid ${isActive ? "#3333ff" : c.border}`,
                  borderRadius: 10,
                  padding: 6,
                  opacity: decided[b] && !won ? 0.55 : 1,
                }}
              >
                {won ? (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 64,
                      fontWeight: 900,
                      color: won === "X" ? "rgba(51,51,255,0.35)" : "rgba(225,29,72,0.35)",
                      pointerEvents: "none",
                    }}
                  >
                    {won}
                  </div>
                ) : null}
                {cells.map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => play(b, i)}
                    aria-label={`board ${b} cell ${i}`}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 6,
                      border: "none",
                      background: c.pill,
                      color: v === "X" ? "#3333ff" : "#e11d48",
                      fontSize: 18,
                      fontWeight: 900,
                      cursor: v || decided[b] || metaWinner || (active !== null && active !== b) ? "default" : "pointer",
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            );
          })}
        </motion.div>

        <p style={{ fontSize: 12, color: c.faint, marginTop: 16, maxWidth: 460, textAlign: "center", lineHeight: 1.6 }}>
          Your move sends the opponent to the matching sub-board. Win 3 sub-boards in a row to take the meta.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          style={{ marginTop: 6, background: c.pill, color: c.text2, border: "none", borderRadius: 999, padding: "10px 18px", fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, ...mono }}
        >
          <RotateCcw size={14} /> Restart
        </button>
      </div>

      <div style={{ textAlign: "center", padding: "0 24px 20px", fontSize: 11, color: c.faint, ...mono }}>
        IDK ARCADE · press ctrl/⌘ K for command search
      </div>
    </div>
  );
}
