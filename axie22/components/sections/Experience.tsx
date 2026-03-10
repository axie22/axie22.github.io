"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { resumeData } from "@/data/resume";
import { FadeIn } from "@/components/animations/FadeIn";

export const Experience = () => {
  return (
    <section id="experience" className="py-16 space-y-8">
      <FadeIn>
        <h2 className="text-4xl font-bold tracking-tight">Experience</h2>
      </FadeIn>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-6 top-6 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent" />

        <div className="space-y-0">
          {resumeData.experience.map((job, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="flex gap-8 relative group">
                {/* Timeline node */}
                <div className="relative z-10 shrink-0">
                  <Avatar className="h-12 w-12 border-2 border-border group-hover:border-primary/60 bg-background rounded-full transition-all duration-300 shadow-sm group-hover:shadow-primary/20 group-hover:shadow-md">
                    <AvatarImage
                      src={job.logo ?? ""}
                      alt={job.company}
                      className="object-contain p-1.5"
                    />
                    <AvatarFallback className="font-bold text-primary text-sm bg-primary/10">
                      {job.company.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Content */}
                <div className="flex-1 pb-12 pt-1">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight leading-tight">
                        {job.role}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium mt-0.5">
                        {job.company} · {job.location}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full font-mono whitespace-nowrap shrink-0">
                      {job.date}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.techStack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-medium bg-primary/10 text-primary border-primary/10 shadow-none"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <ul className="space-y-2">
                    {job.points.map((point, idx) => (
                      <li key={idx} className="flex gap-2.5 text-sm">
                        <div className="mt-2 shrink-0 h-1.5 w-1.5 rounded-full bg-primary/40" />
                        <span className="text-foreground/85 leading-relaxed">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
