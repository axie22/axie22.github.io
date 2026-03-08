"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <div className="space-y-6">
        {resumeData.experience.map((job, index) => (
          <FadeIn key={index} delay={index * 0.1}>
            <Card className="transition-all hover:bg-muted/50 border-l-4 border-l-primary/50">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                     <Avatar className="h-12 w-12 border bg-background rounded-md">
                        <AvatarImage src={job.logo ?? ""} alt={job.company} className="object-cover" />
                        <AvatarFallback className="font-bold text-primary">
                            {job.company.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                     </Avatar>
                    <div>
                        <CardTitle className="text-xl">{job.role}</CardTitle>
                        <CardDescription className="text-base font-medium text-foreground/80">
                            {job.company} • {job.location}
                        </CardDescription>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full font-mono whitespace-nowrap">
                    {job.date}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
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
              </CardHeader>
              <CardContent>
                <ul className="list-disc leading-relaxed space-y-2 pl-5 text-muted-foreground">
                  {job.points.map((point, idx) => (
                    <li key={idx}>
                      <span className="text-foreground/90">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};
