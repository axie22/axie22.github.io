// Configuration for the "live forward pass" hero. Content (prompt + interests) lives at the top;
// look-and-feel constants below mirror the prototype (forward-pass-hero.html).

export type Candidate = readonly [token: string, prob: number];

export type Interest = { label: string; p: number; toks: readonly string[] };

export const PROMPT = "Currently thinking about";
export const TOP_P = 0.95;
/** Pause after a finished run before sampling again. */
export const LOOP_DELAY_S = 4.5;

/* What I'm into right now. Edit freely: p is the probability shown at the first decode step
   (keep the sum <= 1; the rest of the vocab is implied). toks = how the interest tokenizes;
   the bars show the first token, later passes finish the word. */
export const INTERESTS: readonly Interest[] = [
  { label: "inference", p: 0.19, toks: [" inference"] },
  { label: "interpretability", p: 0.17, toks: [" interpret", "ability"] },
  { label: "post-training", p: 0.15, toks: [" post", "-training"] },
  { label: "safety", p: 0.13, toks: [" safety"] },
  { label: "optimization", p: 0.12, toks: [" optim", "ization"] },
  {
    label: "multi-agent orchestration",
    p: 0.11,
    toks: [" multi", "-agent", " orchestration"],
  },
  { label: "infra", p: 0.09, toks: [" infra"] },
];

/* Continuation distributions, keyed by the token being predicted.
   Winner first, with p >= TOP_P so the nucleus is a single token (deterministic).
   Runner-ups are deliberate jokes (post → "gres", optim → "ism"); keep them. */
export const CONT: Record<string, readonly Candidate[]> = {
  ability: [
    ["ability", 0.96],
    ["ing", 0.015],
    ["able", 0.01],
    ["ation", 0.007],
    ["ive", 0.004],
    ["er", 0.002],
  ],
  "-training": [
    ["-training", 0.95],
    ["-hoc", 0.02],
    ["gres", 0.012],
    ["-mortem", 0.008],
    ["-doc", 0.005],
    ["ers", 0.003],
  ],
  ization: [
    ["ization", 0.96],
    ["izer", 0.02],
    ["ism", 0.008],
    ["al", 0.006],
    ["ize", 0.004],
    ["izing", 0.002],
  ],
  "-agent": [
    ["-agent", 0.95],
    ["modal", 0.025],
    ["-head", 0.01],
    ["-GPU", 0.007],
    ["-task", 0.005],
    ["-step", 0.003],
  ],
  " orchestration": [
    [" orchestration", 0.95],
    [" systems", 0.02],
    [" RL", 0.012],
    [" debate", 0.008],
    [" memory", 0.006],
    [" chaos", 0.004],
  ],
  ".": [
    [".", 0.96],
    [",", 0.015],
    [" and", 0.01],
    ["!", 0.007],
    ["...", 0.005],
    [" (", 0.003],
  ],
};

const listJoin = (xs: readonly string[]) =>
  xs.length < 2
    ? xs.join("")
    : `${xs.slice(0, -1).join(", ")}, and ${xs[xs.length - 1]}`;

/** Stable description under the (changing) tagline; also the meta description. Generated so it can't drift from INTERESTS. */
export const SUBLINE = `Software engineer at IBM. Into ${listJoin(INTERESTS.map((i) => i.label))}.`;

/** Let visitors type their own prompt. Custom prompts get greedy, pseudo-random candidates from CUSTOM_POOL. */
export const ALLOW_CUSTOM_PROMPT = true;
export const CUSTOM_POOL = [
  " models",
  " systems",
  " data",
  " agents",
  " inference",
  " tokens",
  " code",
  " things",
  ".",
  " at",
  " scale",
];
export const CUSTOM_STEPS = 2;

export const MAX_PROMPT_TOKENS = 7;
export const MAX_INTEREST_TOKENS = 3;

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
  cachedSpeedup: 2, // KV-cached passes (steps >= 1) play faster so a 4-pass run stays under ~45 s
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
