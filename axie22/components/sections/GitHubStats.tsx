"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { resumeData } from "@/data/resume";

export const GitHubStats = () => {
    // We can extract the username from the github URL
    const githubUsername = resumeData.personalInfo.contact.github.split("/").pop();

  return (
    <section id="github" className="py-12 space-y-8">
      <FadeIn>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold tracking-tight">GitHub Activity</h2>
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
                    We use a generic color scheme or text color to try match theme, 
                    but the default green is usually fine/recognizable for GitHub.
                */}
                <img 
                    src={`https://ghchart.rshah.org/${githubUsername}`} 
                    alt="GitHub Contribution Graph" 
                    className="w-full min-w-[700px]"
                />
            </div>
        </div>
      </FadeIn>
    </section>
  );
};
