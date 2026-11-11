import { describe, expect, it } from "vitest";
import { buildGrid, levelFor, parseContributions, formatDay } from "@/lib/github-contributions";

describe("levelFor", () => {
  it("uses fixed thresholds so low-activity days are visible", () => {
    expect([0, 1, 2, 3, 5, 6, 9, 10, 40].map(levelFor)).toEqual([0, 1, 1, 2, 2, 3, 3, 4, 4]);
  });
});

describe("parseContributions", () => {
  it("accepts the API shape and sorts by date", () => {
    const out = parseContributions({ total: { lastYear: 3 }, contributions: [
      { date: "2026-01-02", count: 1, level: 1 }, { date: "2026-01-01", count: 2, level: 2 }] });
    expect(out).toEqual([{ date: "2026-01-01", count: 2 }, { date: "2026-01-02", count: 1 }]);
  });
  it.each([null, {}, { contributions: [] }, { contributions: [{ date: "nope", count: 1 }] },
    { contributions: [{ date: "2026-01-01", count: -1 }] }, { error: "rate limited" }])(
    "rejects bad payload %#", (bad) => { expect(parseContributions(bad)).toBeNull(); });
});

describe("buildGrid", () => {
  const days = (start: string, n: number) => Array.from({ length: n }, (_, i) => {
    const d = new Date(start + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + i);
    return { date: d.toISOString().slice(0, 10), count: i % 4 };
  });

  it("pads the first week so day 0 lands on its weekday (Sun = row 0)", () => {
    const g = buildGrid(days("2025-11-12", 10)); // 2025-11-12 is a Wednesday
    expect(g.weeks[0].slice(0, 3)).toEqual([null, null, null]);
    expect(g.weeks[0][3]?.date).toBe("2025-11-12");
    expect(g.weeks.every((w) => w.length === 7)).toBe(true);
  });

  it("covers a full year in 53 columns with month labels in order", () => {
    const g = buildGrid(days("2025-11-12", 365));
    expect(g.weeks.length).toBeGreaterThanOrEqual(53);
    expect(g.months.length).toBeGreaterThanOrEqual(11);
    const weeksIdx = g.months.map((m) => m.week);
    expect([...weeksIdx].sort((a, b) => a - b)).toEqual(weeksIdx);
    expect(g.total).toBe(days("2025-11-12", 365).reduce((s, c) => s + c.count, 0));
  });

  it("formats days without timezone drift", () => {
    expect(formatDay("2026-03-01")).toBe("Mar 1, 2026");
  });
});
