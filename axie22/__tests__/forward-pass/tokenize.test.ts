import { describe, expect, it } from "vitest";
import { disp, tokenize } from "@/lib/forward-pass/tokenize";

describe("tokenize", () => {
  it("tokenizes the default headline", () => {
    expect(tokenize("Building ML systems that")).toEqual(["Build", "ing", " ML", " systems", " that"]);
  });

  it("round-trips to the original text", () => {
    const s = "Shipping inference servers, 24/7!";
    expect(tokenize(s).join("")).toBe(s);
  });

  it("splits long words without a known suffix", () => {
    expect(tokenize("transformers")).toEqual(["trans", "formers"]);
  });

  it("returns nothing for empty or whitespace input", () => {
    expect(tokenize("")).toEqual([]);
    expect(tokenize("   \n\t ")).toEqual([]);
  });

  it("gives each punctuation character its own token", () => {
    expect(tokenize("?!.")).toEqual(["?", "!", "."]);
    expect(tokenize(" ... ")).toEqual([".", ".", "."]);
  });
});

describe("disp", () => {
  it("shows a leading space as a middle dot", () => {
    expect(disp(" scale")).toBe("·scale");
    expect(disp("<bos>")).toBe("<bos>");
    expect(disp(".")).toBe(".");
  });
});
