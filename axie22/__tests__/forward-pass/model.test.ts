import { describe, expect, it } from "vitest";
import { HEADLINE, L, S } from "@/lib/forward-pass/config";
import { computeModel, getCandidates, validateHeadline } from "@/lib/forward-pass/model";
import { tokenize } from "@/lib/forward-pass/tokenize";

const toks = ["<bos>", ...tokenize(HEADLINE.prompt)];

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
    const after = computeModel([...toks, " scale"]);
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

describe("getCandidates", () => {
  it("returns the scripted steps for the default prompt", () => {
    HEADLINE.steps.forEach((step, i) => expect(getCandidates(toks, i, true)).toBe(step));
  });

  it("returns 6 sorted, deterministic candidates for custom prompts", () => {
    const t = ["<bos>", ...tokenize("hello world")];
    const c = getCandidates(t, 0, false);
    expect(c).toHaveLength(6);
    for (let k = 1; k < c.length; k++) expect(c[k][1]).toBeLessThanOrEqual(c[k - 1][1]);
    expect(getCandidates(t, 0, false)).toEqual(c);
  });
});

describe("HEADLINE", () => {
  it("passes validation", () => {
    expect(validateHeadline()).toEqual([]);
  });
});
