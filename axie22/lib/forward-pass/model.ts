// Toy decoder-only transformer. Activations and attention are deterministic pseudo-random
// (hash-based), shaped so the heads resemble patterns real models show. Not real model internals.
import { CONT, CUSTOM_POOL, CUSTOM_STEPS, D_DESKTOP, INTERESTS, L, MAX_INTEREST_TOKENS, MAX_PROMPT_TOKENS, PROMPT, S, TOP_P, type Candidate, type Interest } from "./config";
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

export const isDefaultPrompt = (text: string) => text.trim() === PROMPT;

/** Step-0 nucleus: interests sorted by p, cut once the cumulative mass reaches TOP_P. */
export function nucleus(): (Interest & { index: number })[] {
  const sorted = INTERESTS.map((it, index) => ({ ...it, index })).sort((a, b) => b.p - a.p);
  const out: typeof sorted = [];
  let cum = 0;
  for (const it of sorted) {
    out.push(it);
    cum += it.p;
    if (cum >= TOP_P) break;
  }
  return out;
}

export type DecodePath = {
  interest: Interest;
  index: number;
  /** The run's decode path: the interest's tokens, then ".". One pass per token. */
  toks: string[];
  /** Size of the step-0 nucleus. */
  nucleus: number;
};

/**
 * Top-p sample an interest for the default prompt. Re-samples if it equals `lastIndex`
 * (no immediate repeats; pass -1 to disable). `force` picks an interest directly (dev screenshots).
 */
export function samplePath(lastIndex = -1, rng: () => number = Math.random, force?: number): DecodePath {
  const nuc = nucleus();
  const z = nuc.reduce((a, c) => a + c.p, 0);
  let pick = force !== undefined ? nuc.find((c) => c.index === force) : undefined;
  while (!pick || (force === undefined && pick.index === lastIndex && nuc.length > 1)) {
    let r = rng() * z;
    pick = nuc.find((c) => (r -= c.p) <= 0) ?? nuc[nuc.length - 1];
  }
  return { interest: INTERESTS[pick.index], index: pick.index, toks: [...pick.toks, "."], nucleus: nuc.length };
}

/** Number of decode passes in a run: the sampled path for the default prompt, CUSTOM_STEPS otherwise. */
export const totalSteps = (path: DecodePath | null) => (path ? path.toks.length : CUSTOM_STEPS);

export type StepCands = {
  /** Bars, sorted descending. */
  cands: readonly Candidate[];
  /** The emitted token: sampled, so not necessarily the tallest bar. */
  winner: string;
  nucleus: number;
  greedy: boolean;
};

export function stepCands(path: DecodePath | null, toks: readonly string[], step: number): StepCands {
  if (path) {
    if (step === 0) {
      const cands = INTERESTS.map((it): Candidate => [it.toks[0], it.p]).sort((a, b) => b[1] - a[1]);
      return { cands, winner: path.toks[0], nucleus: path.nucleus, greedy: false };
    }
    const tok = path.toks[step];
    return { cands: CONT[tok], winner: tok, nucleus: 1, greedy: false };
  }
  const c = getCandidates(toks, step);
  return { cands: c, winner: c[0][0], nucleus: 1, greedy: true };
}

/** Custom prompts: top-6 pseudo-random candidates from a small pool, sorted descending (greedy). */
export function getCandidates(toks: readonly string[], step: number): readonly Candidate[] {
  const last = step === CUSTOM_STEPS - 1;
  const sc = CUSTOM_POOL.map((t) => [t, hash("c", toks.join("|"), t) * 3 + (last && t === "." ? 2.2 : 0)] as const);
  const mx = Math.max(...sc.map((s) => s[1]));
  const ex = sc.map(([t, v]) => [t, Math.exp(v - mx)] as const);
  const z = ex.reduce((a, c) => a + c[1], 0);
  return ex
    .map(([t, v]): Candidate => [t, v / z])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
}

/** Problems with the prompt/interest config that would break sampling or crowd the scene. Logged as dev-only warnings. */
export function validateConfig(): string[] {
  const w: string[] = [];
  const n = tokenize(PROMPT).length;
  if (n === 0) w.push("PROMPT tokenizes to nothing.");
  if (n > MAX_PROMPT_TOKENS) w.push(`PROMPT is ${n} tokens; only the first ${MAX_PROMPT_TOKENS} are used.`);
  const inNucleus = new Set(nucleus().map((c) => c.index));
  INTERESTS.forEach((it, i) => {
    if (!inNucleus.has(i)) w.push(`Interest "${it.label}" falls outside the top-p nucleus (p=${TOP_P}) and can never be sampled.`);
    if (it.toks.length > MAX_INTEREST_TOKENS) w.push(`Interest "${it.label}" is ${it.toks.length} tokens; keep it <= ${MAX_INTEREST_TOKENS}.`);
    for (const t of [...it.toks.slice(1), "."]) if (!CONT[t]) w.push(`CONT is missing an entry for "${t}" (interest "${it.label}").`);
  });
  if (INTERESTS.reduce((a, c) => a + c.p, 0) > 1 + 1e-9) w.push("INTERESTS probabilities sum to more than 1.");
  for (const [key, cands] of Object.entries(CONT)) {
    if (cands[0]?.[0] !== key) w.push(`CONT["${key}"] should list "${key}" first.`);
    if ((cands[0]?.[1] ?? 0) < TOP_P) w.push(`CONT["${key}"] winner is below TOP_P, so the nucleus won't collapse to one token.`);
    if (cands.some((c, k) => k > 0 && c[1] > cands[k - 1][1])) w.push(`CONT["${key}"] isn't sorted descending.`);
  }
  const labels = [...INTERESTS.map((it) => it.toks[0]), ...Object.values(CONT).flatMap((c) => c.map((x) => x[0]))];
  // ~12 is comfortable; " orchestration" (14) still fits because CONT winners sit alone over the last column.
  for (const t of labels) if (t.length > 14) w.push(`Bar label "${t}" is long; labels may collide.`);
  return w;
}
