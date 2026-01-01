"use client";

import { Badge } from "@/components/ui/badge";
import { resumeData } from "@/data/resume";
import { FadeIn } from "@/components/animations/FadeIn";
import { Marquee } from "@/components/ui/Marquee";

export const Skills = () => {
    // Flatten skills for the marquee or keep categories as rows
    const allSkills = [
        ...resumeData.skills.languages,
        ...resumeData.skills.devTools,
        ...resumeData.skills.cloudDevOps,
    ];

    // Split into two rows for visual interest
    const firstRow = allSkills.slice(0, Math.ceil(allSkills.length / 2));
    const secondRow = allSkills.slice(Math.ceil(allSkills.length / 2));

  return (
    <section id="skills" className="py-12 space-y-8 overflow-hidden">
      <FadeIn>
        <h2 className="text-3xl font-bold tracking-tight mb-6">Skills</h2>
      </FadeIn>
      
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden py-4">
        {/* First Marquee Row */}
        <Marquee pauseOnHover className="[--duration:30s]">
            {firstRow.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-4 py-2 text-md mx-2 border-primary/20">
                    {skill}
                </Badge>
            ))}
        </Marquee>

        {/* Second Marquee Row (Reverse) */}
        <Marquee reverse pauseOnHover className="[--duration:30s]">
            {secondRow.map((skill) => (
                <Badge key={skill} variant="outline" className="px-4 py-2 text-md mx-2 border-primary/20 bg-background/50 backdrop-blur-sm">
                    {skill}
                </Badge>
            ))}
        </Marquee>
        
        {/* Left/Right Gradients for fade effect */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent dark:from-background"></div>
      </div>
    </section>
  );
};
