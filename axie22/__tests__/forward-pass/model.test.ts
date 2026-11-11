import { describe, expect, it } from "vitest";
import { CONT, CUSTOM_STEPS, INTERESTS, L, PROMPT, S, TOP_P } from "@/lib/forward-pass/config";
import { computeModel, nucleus, samplePath, stepCands, totalSteps, validateConfig } from "@/lib/forward-pass/model";
import { tokenize } from "@/lib/forward-pass/tokenize";

const toks = ["<bos>", ...tokenize(PROMPT)];

/** Seeded PRNG (mulberry32) so sampling tests are deterministic. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("computeModel", () => {
  it("attention is causal and each row sums to 1", () => {
    const { W, T } = computeModel(toks);
    expect(W).toHaveLength(L);
    for (let b = 0; b < L; b++)
      for (let i = 0; i < T; i++) {
        expect(W[b][i]).toHaveLength(i + 1); // only j <= i is defined
        const sum = W[b][i].reduce((a, c) => a + c, 0);
        expect(Math.abs(sum - 1)).toBeLessThan(1e-6);
      }
  });

  it("KV cache: appending a token leaves earlier columns unchanged", () => {
    const before = computeModel(toks);
    const after = computeModel([...toks, " inference"]);
    for (let i = 0; i < toks.length; i++) {
      expect(after.V[i]).toEqual(before.V[i]);
      for (let b = 0; b < L; b++) expect(after.W[b][i]).toEqual(before.W[b][i]);
    }
  });

  it("is deterministic", () => {
    expect(computeModel(toks)).toEqual(computeModel([...toks]));
  });

  it("produces S levels of `dims` values in (-1, 1)", () => {
    const { V } = computeModel(toks, 8);
    for (const col of V) {
      expect(col).toHaveLength(S);
      for (const row of col) {
        expect(row).toHaveLength(8);
        for (const v of row) expect(Math.abs(v)).toBeLessThan(1);
      }
    }
  });

  it("mobile dims are a prefix of desktop dims", () => {
    const a = computeModel(toks, 8).V;
    const b = computeModel(toks, 16).V;
    a.forEach((col, i) => col.forEach((row, s) => expect(row).toEqual(b[i][s].slice(0, 8))));
  });
});

describe("samplePath", () => {
  it("matches the renormalized nucleus distribution (no-repeat disabled)", () => {
    const rng = mulberry32(42);
    const N = 10_000;
    const counts = new Array(INTERESTS.length).fill(0);
    for (let n = 0; n < N; n++) counts[samplePath(-1, rng).index]++;
    const nuc = nucleus();
    const z = nuc.reduce((a, c) => a + c.p, 0);
    for (const c of nuc) expect(Math.abs(counts[c.index] / N - c.p / z)).toBeLessThan(0.015);
    // every interest is reachable
    expect(counts.every((c) => c > 0)).toBe(true);
  });

  it("decode path is the interest's tokens then '.'", () => {
    INTERESTS.forEach((it, i) => {
      const path = samplePath(-1, Math.random, i);
      expect(path.toks).toEqual([...it.toks, "."]);
      expect(totalSteps(path)).toBe(it.toks.length + 1);
    });
  });

  it("never repeats the previous interest", () => {
    const rng = mulberry32(7);
    let last = -1;
    for (let n = 0; n < 500; n++) {
      const { index } = samplePath(last, rng);
      expect(index).not.toBe(last);
      last = index;
    }
  });
});

describe("stepCands", () => {
  it("step 0 shows every interest's first token, highlights the sampled one", () => {
    const path = samplePath(-1, Math.random, 1); // interpretability, not the tallest bar
    const st = stepCands(path, toks, 0);
    expect(st.cands).toHaveLength(INTERESTS.length);
    for (let k = 1; k < st.cands.length; k++) expect(st.cands[k][1]).toBeLessThanOrEqual(st.cands[k - 1][1]);
    expect(st.winner).toBe(" interpret");
    expect(st.cands[0][0]).not.toBe(st.winner);
    expect(st.nucleus).toBe(nucleus().length);
    expect(st.greedy).toBe(false);
  });

  it("later steps read CONT and collapse to one token", () => {
    const path = samplePath(-1, Math.random, 5); // multi-agent orchestration
    for (let step = 1; step < totalSteps(path); step++) {
      const st = stepCands(path, toks, step);
      expect(st.winner).toBe(path.toks[step]);
      expect(st.cands).toBe(CONT[path.toks[step]]);
      expect(st.cands[0][1]).toBeGreaterThanOrEqual(TOP_P);
      expect(st.nucleus).toBe(1);
    }
  });

  it("custom prompts: greedy over 6 sorted, deterministic candidates", () => {
    const t = ["<bos>", ...tokenize("hello world")];
    expect(totalSteps(null)).toBe(CUSTOM_STEPS);
    const st = stepCands(null, t, 0);
    expect(st.greedy).toBe(true);
    expect(st.cands).toHaveLength(6);
    expect(st.winner).toBe(st.cands[0][0]);
    for (let k = 1; k < st.cands.length; k++) expect(st.cands[k][1]).toBeLessThanOrEqual(st.cands[k - 1][1]);
    expect(stepCands(null, t, 0)).toEqual(st);
  });
});

describe("config", () => {
  it("passes validation", () => {
    expect(validateConfig()).toEqual([]);
  });
});
