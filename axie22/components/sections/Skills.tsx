"use client";

import { Badge } from "@/components/ui/badge";
import { resumeData } from "@/data/resume";
import { FadeIn } from "@/components/animations/FadeIn";
import { Marquee } from "@/components/ui/Marquee";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export const Skills = () => {
    const allSkills = [
        ...resumeData.skills.languages,
        ...resumeData.skills.devTools,
        ...resumeData.skills.cloudDevOps,
    ];

    const firstRow = allSkills.slice(0, Math.ceil(allSkills.length / 2));
    const secondRow = allSkills.slice(Math.ceil(allSkills.length / 2));

  return (
    <section id="skills" className="py-12 space-y-12">
      <div className="space-y-8 overflow-hidden">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight mb-6">Skills</h2>
          </FadeIn>
          
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden py-4">
            <Marquee pauseOnHover className="[--duration:30s]">
                {firstRow.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-4 py-2 text-md mx-2 border-primary/20">
                        {skill}
                    </Badge>
                ))}
            </Marquee>

            <Marquee reverse pauseOnHover className="[--duration:30s]">
                {secondRow.map((skill) => (
                    <Badge key={skill} variant="outline" className="px-4 py-2 text-md mx-2 border-primary/20 bg-background/50 backdrop-blur-sm">
                        {skill}
                    </Badge>
                ))}
            </Marquee>
            
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent dark:from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent dark:from-background"></div>
          </div>
      </div>

      <div className="space-y-6">
          <FadeIn>
            <h3 className="text-2xl font-semibold tracking-tight">Certifications</h3>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {resumeData.skills.certifications.map((cert: any, index: number) => (
                  <FadeIn key={index} delay={index * 0.1}>
                      <Link href={cert.link} target="_blank" rel="noopener noreferrer">
                          <Card className="hover:bg-muted/50 transition-colors h-full">
                              <CardContent className="flex items-center gap-4 p-4">
                                  <div className="relative w-16 h-16 shrink-0">
                                      {/* Using standard img tag for simplicity within component if next/image is tricky with external or local path config without width/height known, but here we set w-16 h-16 so layout is fixed. */}
                                      <Image 
                                        src={cert.image} 
                                        alt={cert.name} 
                                        fill 
                                        className="object-contain"
                                      />
                                  </div>
                                  <span className="font-medium leading-tight">{cert.name}</span>
                              </CardContent>
                          </Card>
                      </Link>
                  </FadeIn>
              ))}
          </div>
      </div>
    </section>
  );
};
