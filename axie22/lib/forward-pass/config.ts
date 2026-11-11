// Configuration for the "live forward pass" hero. Content (headline) lives at the top;
// look-and-feel constants below mirror the prototype (forward-pass-hero.html).

export type Candidate = readonly [token: string, prob: number];

export const HEADLINE: {
  prompt: string;
  steps: readonly (readonly Candidate[])[];
} = {
  // TODO(alex): replace. Placeholder from the prototype.
  prompt: "Building ML systems that",
  // One entry per decode step. First item of each list is the winner (greedy).
  // Probabilities are for display; they don't need to sum to 1 (the rest of the vocab is implied).
  steps: [
    [[" scale", 0.41], [" learn", 0.22], [" ship", 0.12], [" work", 0.08], [" matter", 0.06], [" think", 0.04]],
    [[".", 0.58], [" well", 0.11], [",", 0.09], [" reliably", 0.07], [" fast", 0.05], [" up", 0.04]],
  ],
};

/** Prompt + every greedy pick, as one string (for meta tags and screen readers). */
export const FULL_HEADLINE = HEADLINE.prompt + HEADLINE.steps.map((s) => s[0][0]).join("");

/** Let visitors type their own prompt. Custom prompts get pseudo-random candidates from CUSTOM_POOL. */
export const ALLOW_CUSTOM_PROMPT = true;
export const CUSTOM_POOL = [" models", " systems", " data", " agents", " inference", " tokens", " code", " things", ".", " at", " scale"];

export const MAX_PROMPT_TOKENS = 7;
export const MAX_GEN_LIMIT = 3;

/* ---------- toy model shape ---------- */
export const D_DESKTOP = 16; // dims shown per vector
export const D_MOBILE = 8;
export const L = 4; // transformer blocks
export const S = 1 + 2 * L; // levels: embed, (attn, mlp) x L

/* ---------- scene layout ---------- */
export const DX = 2.0;
export const DZ = 0.24;
export const CUBE = 0.17;
export const LEVEL_H = 1.35;
export const levelY = (s: number) => s * LEVEL_H;
export const TOP_Y = levelY(S - 1);
export const LOGIT_Y = TOP_Y + 1.9;

/* ---------- timing (seconds per stage) ---------- */
export const TIMING = {
  embed: 1.4,
  attn: 1.6,
  mlp: 1.0,
  logits: 1.8,
  hold: 0.9, // pause at the top before the next decode step
  cachedSpeedup: 1.35, // KV-cached passes play a bit faster
};

/* ---------- rendering ---------- */
export const MOBILE_BREAKPOINT = 800;
export const MAX_DPR = { desktop: 1.75, mobile: 1.5 };

export const COLORS = {
  bg: "#07090d",
  fg: "#e6e9ef",
  dim: "#8a93a6",
  amber: "#ffb454",
  cyan: "#4cc9f0",
  violet: "#b388ff",
  cubeDim: "#252c3c",
  plate: "#1f2636",
  plateHi: "#6b7690",
  slate: "#3a4560",
  tokenLabel: "#c9d0dc",
  gridCenter: 0x161b26,
  grid: 0x10141c,
};

export const POSTER_URL = "/forward-pass/poster.png";
