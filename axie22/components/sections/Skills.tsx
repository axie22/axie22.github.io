"use client";

import { Badge } from "@/components/ui/badge";
import { resumeData } from "@/data/resume";
import { FadeIn } from "@/components/animations/FadeIn";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const SKILL_GROUPS = [
  { label: "Languages", key: "languages" as const },
  { label: "Frameworks & Tools", key: "frameworks" as const },
  { label: "Cloud & Infrastructure", key: "infrastructure" as const },
] as const;

export const Skills = () => {
  return (
    <section id="skills" className="py-16 space-y-12">
      <FadeIn>
        <h2 className="text-4xl font-bold tracking-tight">Skills</h2>
      </FadeIn>

      <div className="space-y-8">
        {SKILL_GROUPS.map(({ label, key }, groupIdx) => (
          <FadeIn key={key} delay={groupIdx * 0.1}>
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-mono">
                {label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills[key].map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm border-primary/15 bg-primary/8 text-foreground/80 hover:bg-primary/15 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="space-y-6">
        <FadeIn>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-mono">
            Certifications
          </h3>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {resumeData.skills.certifications.map((cert, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <Link href={cert.link} target="_blank" rel="noopener noreferrer">
                <Card className="hover:bg-muted/50 transition-colors h-full">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="relative w-16 h-16 shrink-0">
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
