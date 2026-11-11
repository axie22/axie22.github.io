/**
 * Helpers for the GitHub contribution graph.
 *
 * Data comes from the public github-contributions API (no token needed), fetched in the browser.
 * We use our own fixed-count levels instead of GitHub's relative quartiles, so a 2–3 commit day
 * always reads as clearly active, regardless of how big the busiest days were.
 */

export interface Contribution {
  date: string; // YYYY-MM-DD
  count: number;
}

export type Level = 0 | 1 | 2 | 3 | 4;

/** Fixed thresholds: 0 · 1–2 · 3–5 · 6–9 · 10+ */
export function levelFor(count: number): Level {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

/**
 * Solid colors (no transparency) for each level: amber (#ffb454) mixed into the card
 * background (#0b0e14) at 45 / 62 / 80 / 100%. The floor is deliberately high so
 * low-activity days don't sink into the empty cells.
 */
export const LEVEL_COLORS: Record<Level, string> = {
  0: "#161b26",
  1: "#795931",
  2: "#a2753c",
  3: "#ce9347",
  4: "#ffb454",
};

const API = "https://github-contributions-api.jogruber.de/v4";

export const contributionsUrl = (username: string) => `${API}/${encodeURIComponent(username)}?y=last`;

/** Validates the API response; returns null if the shape isn't what we expect (caller falls back). */
export function parseContributions(json: unknown): Contribution[] | null {
  if (!json || typeof json !== "object") return null;
  const list = (json as { contributions?: unknown }).contributions;
  if (!Array.isArray(list) || list.length === 0) return null;
  const out: Contribution[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") return null;
    const { date, count } = item as { date?: unknown; count?: unknown };
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
    if (typeof count !== "number" || !Number.isFinite(count) || count < 0) return null;
    out.push({ date, count });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

/** Parses YYYY-MM-DD as a UTC date so the day of week never shifts with the viewer's timezone. */
const utc = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

export interface Grid {
  /** weeks[w][d]: d = 0 (Sun) … 6 (Sat); null = padding outside the date range */
  weeks: (Contribution | null)[][];
  /** Month label at the first week column whose first real day starts a new month */
  months: { week: number; label: string }[];
  total: number;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Lays contributions out GitHub-style: one column per week (Sun→Sat), oldest week first. */
export function buildGrid(contribs: Contribution[]): Grid {
  const weeks: (Contribution | null)[][] = [];
  if (contribs.length === 0) return { weeks, months: [], total: 0 };

  const startDow = utc(contribs[0].date).getUTCDay();
  let week: (Contribution | null)[] = Array(startDow).fill(null);
  for (const c of contribs) {
    week.push(c);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length) weeks.push([...week, ...Array(7 - week.length).fill(null)]);

  const months: Grid["months"] = [];
  let lastMonth = -1;
  weeks.forEach((w, i) => {
    const first = w.find((c): c is Contribution => c !== null);
    if (!first) return;
    const m = utc(first.date).getUTCMonth();
    if (m !== lastMonth) {
      // Skip a label squeezed into the very first column if the next month starts within 2 weeks
      if (!(i === 0 && w.filter(Boolean).length < 7 && weeks.length > 2)) months.push({ week: i, label: MONTHS[m] });
      lastMonth = m;
    }
  });

  return { weeks, months, total: contribs.reduce((s, c) => s + c.count, 0) };
}

export function formatDay(iso: string): string {
  const d = utc(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}
