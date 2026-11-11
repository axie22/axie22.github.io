"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { resumeData } from "@/data/resume";

export const GitHubStats = () => {
    // We can extract the username from the github URL
    const githubUsername = resumeData.personalInfo.contact.github.split("/").pop();

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
        <div className="w-full overflow-hidden rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 overflow-x-auto">
                {/* Using ghchart.rshah.org for the contribution graph. 
                    It returns an SVG image of the contribution graph.
                    The SVG has a light background and empty cells, so it's inverted (hue-rotated back)
                    to sit on the dark card; the hex in the path is picked so filled cells come out amber.
                */}
                <img
                    src={`https://ghchart.rshah.org/ffb454/${githubUsername}`}
                    alt="GitHub contribution graph"
                    width={900}
                    height={120}
                    loading="lazy"
                    className="w-full min-w-[700px] [filter:invert(1)_hue-rotate(180deg)_brightness(1.6)_saturate(1.4)]"
                />
            </div>
        </div>
      </FadeIn>
    </section>
  );
};
