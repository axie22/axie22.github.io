"use client";

import { useEffect, useMemo, useState } from "react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { resumeData } from "@/data/resume";
import {
  buildGrid,
  contributionsUrl,
  formatDay,
  LEVEL_COLORS,
  levelFor,
  parseContributions,
  type Contribution,
  type Level,
} from "@/lib/github-contributions";

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;
const LEFT = 30; // room for Mon / Wed / Fri labels
const TOP = 18; // room for month labels
const SKELETON_WEEKS = 53;

type State = { status: "loading" } | { status: "ready"; data: Contribution[] } | { status: "error" };

export const GitHubStats = () => {
  const githubUsername = resumeData.personalInfo.contact.github.split("/").pop() ?? "";
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(contributionsUrl(githubUsername), { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((json) => {
        const data = parseContributions(json);
        setState(data ? { status: "ready", data } : { status: "error" });
      })
      .catch((err) => {
        if ((err as Error).name !== "AbortError") setState({ status: "error" });
      });
    return () => ctrl.abort();
  }, [githubUsername]);

  const grid = useMemo(() => (state.status === "ready" ? buildGrid(state.data) : null), [state]);

  return (
    <section id="github" className="py-16 space-y-8">
      <FadeIn>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl font-bold tracking-tight">GitHub Activity</h2>
          <Button variant="outline" size="sm" asChild>
            <a href={resumeData.personalInfo.contact.github} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              View Profile
            </a>
          </Button>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="w-full overflow-hidden rounded-xl border bg-card text-card-foreground">
          <div className="p-6 overflow-x-auto">
            {state.status === "error" ? (
              // Fallback: the third-party API is down or changed shape, so show the old image-based chart.
              <img
                src={`https://ghchart.rshah.org/ffb454/${githubUsername}`}
                alt="GitHub contribution graph"
                width={900}
                height={120}
                loading="lazy"
                className="w-full min-w-[700px] [filter:invert(1)_hue-rotate(180deg)_brightness(1.6)_saturate(1.4)]"
              />
            ) : (
              <ContributionGraph grid={grid} />
            )}
          </div>
        </div>
      </FadeIn>
    </section>
  );
};

function ContributionGraph({ grid }: { grid: ReturnType<typeof buildGrid> | null }) {
  const weeks = grid?.weeks ?? Array.from({ length: SKELETON_WEEKS }, () => Array(7).fill(null));
  const width = LEFT + weeks.length * STEP;
  const height = TOP + 7 * STEP;
  const label = grid
    ? `${grid.total.toLocaleString()} GitHub contributions in the last year`
    : "Loading GitHub contributions";

  return (
    <div className="min-w-[700px]">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label={label}
        aria-busy={!grid}
      >
        {grid?.months.map((m) => (
          <text key={`${m.week}-${m.label}`} x={LEFT + m.week * STEP} y={11} className="fill-muted-foreground" fontSize={10}>
            {m.label}
          </text>
        ))}
        {[["Mon", 1], ["Wed", 3], ["Fri", 5]].map(([d, row]) => (
          <text key={d} x={0} y={TOP + (row as number) * STEP + CELL - 2} className="fill-muted-foreground" fontSize={9}>
            {d}
          </text>
        ))}
        {weeks.map((week, w) =>
          week.map((day, d) => {
            if (grid && !day) return null; // padding outside the date range
            const level: Level = day ? levelFor(day.count) : 0;
            return (
              <rect
                key={`${w}-${d}`}
                x={LEFT + w * STEP}
                y={TOP + d * STEP}
                width={CELL}
                height={CELL}
                rx={2}
                fill={LEVEL_COLORS[level]}
              >
                {day && (
                  <title>
                    {`${day.count === 0 ? "No" : day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDay(day.date)}`}
                  </title>
                )}
              </rect>
            );
          }),
        )}
      </svg>

      <div className="mt-3 flex items-center justify-between gap-4 text-xs text-muted-foreground">
        <span>{grid ? label : " "}</span>
        <span className="flex items-center gap-1.5" aria-hidden="true">
          Less
          {([0, 1, 2, 3, 4] as Level[]).map((l) => (
            <span key={l} className="inline-block h-[11px] w-[11px] rounded-[2px]" style={{ background: LEVEL_COLORS[l] }} />
          ))}
          More
        </span>
      </div>
    </div>
  );
}
