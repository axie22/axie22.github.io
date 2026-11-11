"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { resumeData, type ExperienceEntry } from "@/data/resume";
import { cn, dateRange, joinTags } from "@/lib/utils";
import { useHydrated } from "@/lib/useHydrated";

const VISIBLE_BULLETS = 2;

const focusRing =
  "focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground";

/** 40px logo tile. Logos are mixed shapes with their own backgrounds, so each fills a white tile. */
function LogoTile({ job }: { job: ExperienceEntry }) {
  const [failed, setFailed] = useState(false);

  if (!job.logo || failed) {
    return (
      <div
        role="img"
        aria-label={job.company}
        className="relative z-10 grid size-10 place-items-center rounded-lg border bg-card text-[13px] font-semibold text-muted-foreground"
      >
        {job.company.slice(0, 2)}
      </div>
    );
  }

  return (
    <div className="relative z-10 size-10 overflow-hidden rounded-lg border bg-white">
      <Image
        src={job.logo}
        alt={job.company}
        width={40}
        height={40}
        className="size-full object-cover"
        style={job.logoScale ? { transform: `scale(${job.logoScale})` } : undefined}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function Bullets({ points }: { points: string[] }) {
  const hydrated = useHydrated();
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const extra = points.length - VISIBLE_BULLETS;
  // Everything is visible until hydration, so no-JS readers and crawlers get every bullet.
  const collapsed = hydrated && extra > 0 && !expanded;

  return (
    <>
      <ul id={listId} className="mt-3">
        {points.map((point, i) => (
          <li
            key={i}
            className={cn(
              "mb-1 flex gap-2.5 text-[14.5px] leading-[1.6] text-foreground/85",
              "before:flex-none before:font-mono before:text-subtle before:content-['+']",
              collapsed && i >= VISIBLE_BULLETS && "hidden"
            )}
          >
            {point}
          </li>
        ))}
      </ul>
      {hydrated && extra > 0 && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((v) => !v)}
          className={cn(
            "pl-[18px] pt-0.5 text-[13px] text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-[3px]",
            focusRing
          )}
        >
          {expanded ? "Show less" : `Show ${extra} more`}
        </button>
      )}
    </>
  );
}

export const Experience = () => {
  const jobs = resumeData.experience;

  return (
    <section id="experience" className="pt-[72px] pb-4">
      <div className="mb-2 font-mono text-[12.5px] text-subtle">$ cat experience.log</div>
      <h2 className="mb-9 text-[36px] font-bold tracking-[-0.03em] max-[600px]:text-[30px]">Experience</h2>

      <div className="relative">
        {/* Residual-stream line: the only cyan in these sections, tying back to the hero. */}
        <div
          aria-hidden="true"
          className="absolute top-1.5 bottom-10 left-[19.5px] w-px bg-[linear-gradient(to_bottom,rgba(76,201,240,.35),rgba(76,201,240,.06))]"
        />

        {jobs.map((job, index) => (
          <article key={job.company + job.date} className="relative grid grid-cols-[40px_1fr] gap-[22px] pb-10">
            <LogoTile job={job} />

            <div className="min-w-0">
              {/* Newest role gets the highest layer number. */}
              <div className="mb-[3px] font-mono text-[11px] text-subtle">
                layer {String(jobs.length - index).padStart(2, "0")}
              </div>

              <div className="flex flex-wrap items-start justify-between gap-x-5 gap-y-1.5">
                <div className="min-w-0">
                  <h3 className="text-[17px] font-semibold tracking-[-0.01em]">{job.role}</h3>
                  <div className="mt-0.5 text-sm text-muted-foreground">
                    {job.company} · {job.location}
                  </div>
                </div>
                <div className="text-right max-[600px]:text-left">
                  <div className="whitespace-nowrap font-mono text-xs text-muted-foreground">{dateRange(job.date)}</div>
                  {job.highlight && <div className="mt-[3px] text-[13.5px] text-primary">{job.highlight}</div>}
                </div>
              </div>

              <Bullets points={job.points} />

              <div className="mt-2.5 font-mono text-xs leading-[1.7] text-subtle">{joinTags(job.techStack)}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
