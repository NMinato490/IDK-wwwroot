"use client";

import * as React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Eraser, Trophy, Shuffle } from "lucide-react";
import { useTheme, palette, ThemeToggle } from "@repo/ui";

const mono: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace",
};

const SOLUTION = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const PUZZLES = [
  "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
  "034678010672100348008342500859700423400853701713920856900537284287410635040286170",
];

function parse(s: string): (number | null)[] {
  return s.split("").map((ch) => {
    const n = parseInt(ch, 10);
    return n >= 1 && n <= 9 ? n : null;
  });
}

function peers(i: number): number[] {
  const r = Math.floor(i / 9);
  const c = i % 9;
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  const set = new Set<number>();
  for (let k = 0; k < 9; k++) {
    set.add(r * 9 + k);
    set.add(k * 9 + c);
  }
  for (let dr = 0; dr < 3; dr++) {
    for (let dc = 0; dc < 3; dc++) {
      set.add((br + dr) * 9 + bc + dc);
    }
  }
  set.delete(i);
  return [...set];
}

export default function Page() {
  const { theme } = useTheme();
  const c = palette[theme];
  const [puzzleIdx, setPuzzleIdx] = React.useState(0);
  const [values, setValues] = React.useState<(number | null)[]>(() => parse(PUZZLES[0]));
  const [selected, setSelected] = React.useState<number | null>(null);
  const [mistakes, setMistakes] = React.useState(0);

  const givens = React.useMemo(() => parse(PUZZLES[puzzleIdx]).map((v) => v !== null), [puzzleIdx]);
  const solution = React.useMemo(() => SOLUTION.split("").map(Number), []);

  const conflicts = React.useMemo(() => {
    const bad = new Set<number>();
    for (let i = 0; i < 81; i++) {
      const v = values[i];
      if (v == null) continue;
      for (const p of peers(i)) {
        if (values[p] === v) {
          bad.add(i);
          bad.add(p);
        }
      }
    }
    return bad;
  }, [values]);

  const won = values.every((v, i) => v === solution[i]);

  const load = (idx: number) => {
    setPuzzleIdx(idx);
    setValues(parse(PUZZLES[idx]));
    setSelected(null);
    setMistakes(0);
  };

  const input = (n: number) => {
    if (selected == null || givens[selected] || won) return;
    if (values[selected] === n) return;
    if (solution[selected] !== n) setMistakes((m) => m + 1);
    const v = [...values];
    v[selected] = n;
    setValues(v);
  };

  const erase = () => {
    if (selected == null || givens[selected] || won) return;
    const v = [...values];
    v[selected] = null;
    setValues(v);
  };

  const filled = values.filter(Boolean).length;

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
          <p style={{ fontSize: 11, letterSpacing: 2, color: c.faint, ...mono }}>IDK ARCADE · SUDOKU</p>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: "8px 0 4px" }}>Sudoku</h1>
          <p style={{ fontSize: 13, color: c.soft, margin: 0, ...mono }}>
            {filled}/81 filled · mistakes: {mistakes}
          </p>
        </motion.div>

        {won ? (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#16a34a", margin: "14px 0 0" }}
          >
            <Trophy size={17} /> Solved with {mistakes} mistake{mistakes === 1 ? "" : "s"}!
          </motion.p>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(9, 38px)",
            gap: 0,
            marginTop: 18,
            background: c.surface,
            border: `2px solid ${c.text2}`,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          {values.map((v, i) => {
            const r = Math.floor(i / 9);
            const col = i % 9;
            const isSel = selected === i;
            const isPeer = selected != null && peers(selected).includes(i);
            const wrong = v != null && v !== solution[i];
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelected(i)}
                style={{
                  width: 38,
                  height: 38,
                  border: "none",
                  borderRight: col === 8 ? "none" : `1px solid ${col === 2 || col === 5 ? c.text2 : c.borderSoft}`,
                  borderBottom: r === 8 ? "none" : `1px solid ${r === 2 || r === 5 ? c.text2 : c.borderSoft}`,
                  background: isSel ? "rgba(51,51,255,0.15)" : isPeer ? "rgba(51,51,255,0.05)" : "transparent",
                  color: givens[i] ? c.text : wrong || conflicts.has(i) ? "#e11d48" : "#3333ff",
                  fontWeight: givens[i] ? 800 : 600,
                  fontSize: 17,
                  cursor: givens[i] ? "default" : "pointer",
                }}
              >
                {v ?? ""}
              </button>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
          style={{ display: "flex", gap: 6, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => input(n)}
              style={{ width: 38, height: 42, borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, color: c.text, fontSize: 16, fontWeight: 700, cursor: "pointer", ...mono }}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={erase}
            aria-label="Erase"
            style={{ width: 44, height: 42, borderRadius: 8, border: `1px solid ${c.border}`, background: c.pill, color: c.text2, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            <Eraser size={16} />
          </button>
        </motion.div>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button
            type="button"
            onClick={() => load((puzzleIdx + 1) % PUZZLES.length)}
            style={{ background: c.pill, color: c.text2, border: "none", borderRadius: 999, padding: "10px 18px", fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, ...mono }}
          >
            <Shuffle size={14} /> New puzzle
          </button>
          <button
            type="button"
            onClick={() => load(puzzleIdx)}
            style={{ background: "transparent", color: c.soft, border: "none", borderRadius: 999, padding: "10px 14px", fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, ...mono }}
          >
            <RotateCcw size={14} /> Restart
          </button>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "0 24px 20px", fontSize: 11, color: c.faint, ...mono }}>
        IDK ARCADE · press ctrl/⌘ K for command search
      </div>
    </div>
  );
}
