// Toy decoder-only transformer. Activations and attention are deterministic pseudo-random
// (hash-based), shaped so the heads resemble patterns real models show. Not real model internals.
import { CUSTOM_POOL, D_DESKTOP, HEADLINE, L, MAX_GEN_LIMIT, MAX_PROMPT_TOKENS, S, type Candidate } from "./config";
import { tokenize } from "./tokenize";

export const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
export const sstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

export function hash(...args: (string | number)[]): number {
  let h = 2166136261 >>> 0;
  for (const a of args) {
    const s = String(a);
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    h ^= 0x9e37;
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

export type Head = { name: string; fn: (i: number, j: number, r: number) => number };

export const HEADS: Head[] = [
  { name: "L1·H2 — previous-token head", fn: (i, j) => (j === i - 1 ? 3.2 : j === i ? 1.0 : 0) },
  { name: "L2·H5 — attention sink on <bos>", fn: (i, j) => (j === 0 ? 3.0 : j === i ? 0.8 : 0) },
  { name: "L3·H1 — content mixing", fn: (_i, _j, r) => r * 2.4 },
  { name: "L4·H7 — local / self", fn: (i, j) => (j === i ? 2.4 : i - j === 1 ? 1.3 : 0) },
];

export type Model = {
  T: number;
  /** W[block][dest i][source j], defined for j <= i only (causal). */
  W: number[][][];
  /** V[token i][level s][dim k], in (-1, 1). */
  V: number[][][];
};

export function computeModel(toks: readonly string[], dims = D_DESKTOP): Model {
  const T = toks.length;
  const W: number[][][] = [];
  const V: number[][][] = toks.map(() => []);
  for (let b = 0; b < L; b++) {
    W[b] = [];
    for (let i = 0; i < T; i++) {
      const sc: number[] = [];
      for (let j = 0; j <= i; j++) sc.push(HEADS[b].fn(i, j, hash("a", b, i, j)) + (hash("n", b, i, j) - 0.5) * 0.6);
      const mx = Math.max(...sc);
      const ex = sc.map((v) => Math.exp(v - mx));
      const z = ex.reduce((a, c) => a + c, 0);
      W[b][i] = ex.map((v) => v / z);
    }
  }
  for (let s = 0; s < S; s++)
    for (let i = 0; i < T; i++) {
      const row: number[] = [];
      for (let k = 0; k < dims; k++) {
        let v: number;
        if (s === 0) v = (hash("e", toks[i], k) * 2 - 1) * 0.9;
        else {
          const prev = V[i][s - 1][k];
          if (s % 2 === 1) {
            // attention: mix earlier tokens only (causal)
            const b = (s - 1) / 2;
            let mix = 0;
            for (let j = 0; j <= i; j++) mix += W[b][i][j] * V[j][s - 1][k];
            v = prev * 0.75 + mix * 0.35 + (hash("r", b, i, k, toks[i]) - 0.5) * 0.4;
          } else v = prev * 0.8 + (hash("m", s, i, k, toks[i]) * 2 - 1) * 0.45; // per-token MLP
        }
        row.push(Math.tanh(v * 1.2));
      }
      V[i][s] = row;
    }
  return { T, W, V };
}

export const genSteps = () => clamp(HEADLINE.steps.length, 1, MAX_GEN_LIMIT);

export const isDefaultPrompt = (text: string) => text.trim() === HEADLINE.prompt;

/** Top-6 next-token candidates for decode `step`, sorted descending. Scripted for the default prompt. */
export function getCandidates(toks: readonly string[], step: number, isDefault: boolean): readonly Candidate[] {
  if (isDefault) return HEADLINE.steps[step];
  const last = step === genSteps() - 1;
  const sc = CUSTOM_POOL.map((t) => [t, hash("c", toks.join("|"), t) * 3 + (last && t === "." ? 2.2 : 0)] as const);
  const mx = Math.max(...sc.map((s) => s[1]));
  const ex = sc.map(([t, v]) => [t, Math.exp(v - mx)] as const);
  const z = ex.reduce((a, c) => a + c[1], 0);
  return ex
    .map(([t, v]): Candidate => [t, v / z])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
}

/** Problems with HEADLINE that would make the visual read oddly. Logged as dev-only warnings. */
export function validateHeadline(): string[] {
  const w: string[] = [];
  const n = tokenize(HEADLINE.prompt).length;
  if (n === 0) w.push("HEADLINE.prompt tokenizes to nothing.");
  if (n > MAX_PROMPT_TOKENS) w.push(`HEADLINE.prompt is ${n} tokens; only the first ${MAX_PROMPT_TOKENS} are used.`);
  if (HEADLINE.steps.length < 1 || HEADLINE.steps.length > MAX_GEN_LIMIT)
    w.push(`HEADLINE.steps has ${HEADLINE.steps.length} steps; expected 1–${MAX_GEN_LIMIT}.`);
  HEADLINE.steps.forEach((cands, i) => {
    if (cands.length !== 6) w.push(`Step ${i} has ${cands.length} candidates; expected 6.`);
    if (cands.some((c, k) => k > 0 && c[1] > cands[k - 1][1])) w.push(`Step ${i} candidates aren't sorted descending.`);
    if (cands[0] && cands[0][1] < 0.25) w.push(`Step ${i} winner "${cands[0][0]}" is only ${Math.round(cands[0][1] * 100)}%; aim for >= 25%.`);
    for (const [t] of cands) if (t.length > 10) w.push(`Step ${i} candidate "${t}" is long; bar labels may collide.`);
  });
  return w;
}
