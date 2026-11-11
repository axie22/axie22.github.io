"use client";

import { useState } from "react";
import { resumeData, type Project, type ProjectCategory } from "@/data/resume";
import { cn, dateRange, joinTags } from "@/lib/utils";
import { useHydrated } from "@/lib/useHydrated";

const focusRing =
  "focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground";

function GitHubLink({ href, title }: { href: string; title: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title} on GitHub`}
      className={cn(
        "whitespace-nowrap text-[13.5px] text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-[3px]",
        focusRing
      )}
    >
      GitHub ↗
    </a>
  );
}

/** "a → b → c". Each "→ step" pair is one nowrap span so an arrow never starts a line alone. */
function Pipeline({ steps }: { steps: string[] }) {
  return (
    <span>
      {steps.map((step, i) =>
        i === 0 ? (
          <span key={i}>{step}</span>
        ) : (
          // The space before the span is the line-break opportunity; inside the span nothing breaks.
          <span key={i}>
            {" "}
            <span className="whitespace-nowrap">
              <span className="text-subtle">→</span> {step}
            </span>
          </span>
        )
      )}
    </span>
  );
}

function FeaturedCard({ project }: { project: Project & { featured: NonNullable<Project["featured"]> } }) {
  const { featured } = project;
  const dt = "mt-3.5 text-[12.5px] text-subtle";
  const dd = "mt-[3px] border-b pb-3.5 text-sm leading-[1.6] text-foreground/90";

  return (
    <article className="flex flex-col rounded-[10px] border bg-card px-[22px] pt-[22px] pb-1.5">
      <div className="mb-1.5 flex justify-between gap-3 text-[12.5px] text-subtle">
        <span>{featured.kind}</span>
        <span className="whitespace-nowrap font-mono">{dateRange(project.date)}</span>
      </div>
      <h3 className="text-[21px] font-semibold tracking-[-0.02em]">{project.title}</h3>
      <p className="mt-1.5 mb-4 text-[14.5px] leading-[1.55] text-muted-foreground">{project.summary}</p>

      <dl className="border-t">
        <dt className={dt}>Architecture</dt>
        <dd className={dd}>
          <Pipeline steps={featured.architecture} />
          {featured.architectureNote && (
            <div className="mt-1.5 text-[13.5px] text-muted-foreground">{featured.architectureNote}</div>
          )}
        </dd>
        <dt className={dt}>How it works</dt>
        <dd className={dd}>{featured.howItWorks}</dd>
        <dt className={dt}>Stack</dt>
        <dd className={cn(dd, "border-b-0 font-mono text-[12.5px] text-muted-foreground")}>
          {joinTags(project.techStack)}
        </dd>
      </dl>

      {/* mt-auto pins the link to the bottom so both cards' links line up. */}
      {project.github && (
        <div className="mt-auto border-t pt-3 pb-3.5">
          <GitHubLink href={project.github} title={project.title} />
        </div>
      )}
    </article>
  );
}

function ProjectRow({ project, hidden }: { project: Project; hidden: boolean }) {
  return (
    <article
      hidden={hidden}
      className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-b py-[18px] max-[600px]:grid-cols-1"
    >
      <div className="min-w-0">
        <h4 className="text-base font-semibold">{project.title}</h4>
        <p className="mt-1 max-w-[640px] text-sm leading-[1.55] text-muted-foreground">{project.summary}</p>
        <div className="mt-1.5 font-mono text-xs leading-[1.7] text-subtle">{joinTags(project.techStack)}</div>
      </div>
      <div className="flex flex-col items-end gap-1.5 text-right max-[600px]:flex-row max-[600px]:items-center max-[600px]:gap-4 max-[600px]:text-left">
        <span className="whitespace-nowrap font-mono text-[11.5px] text-subtle">{dateRange(project.date)}</span>
        {project.github && <GitHubLink href={project.github} title={project.title} />}
      </div>
    </article>
  );
}

type Filter = "All" | ProjectCategory;

export const Projects = () => {
  const hydrated = useHydrated();
  const [filter, setFilter] = useState<Filter>("All");

  const projects: Project[] = resumeData.projects;
  const featured = projects.filter(
    (p): p is Project & { featured: NonNullable<Project["featured"]> } => !!p.featured
  );
  const rows = projects.filter((p) => !p.featured);
  // Tabs come from the rows themselves, in first-appearance order, so an empty category never gets a tab.
  const tabs: Filter[] = ["All", ...new Set(rows.map((p) => p.category))];

  return (
    <section id="projects" className="pt-[72px] pb-4">
      <div className="mb-2 font-mono text-[12.5px] text-subtle">$ ls projects/</div>
      <h2 className="mb-9 text-[36px] font-bold tracking-[-0.03em] max-[600px]:text-[30px]">Projects</h2>

      <div className="grid grid-cols-2 gap-4 max-[800px]:grid-cols-1">
        {featured.map((project) => (
          <FeaturedCard key={project.title} project={project} />
        ))}
      </div>

      <div className="mt-14 mb-1 flex flex-wrap items-baseline justify-between gap-4">
        <h3 className="text-lg font-semibold">More projects</h3>
        <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-[18px]">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              aria-pressed={filter === tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "border-b border-transparent py-1 text-[13.5px] text-muted-foreground hover:text-foreground",
                filter === tab && "border-primary text-foreground",
                focusRing
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t">
        {rows.map((project) => (
          <ProjectRow
            key={project.title}
            project={project}
            // Filter only after hydration, so no-JS readers see every row. Rows stay mounted.
            hidden={hydrated && filter !== "All" && project.category !== filter}
          />
        ))}
      </div>
    </section>
  );
};
