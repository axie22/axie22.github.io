"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { resumeData } from "@/data/resume";
import { FadeIn } from "@/components/animations/FadeIn";

export const Experience = () => {
  return (
    <section id="experience" className="py-12 space-y-8">
      <FadeIn>
        <h2 className="text-3xl font-bold tracking-tight">Experience</h2>
      </FadeIn>
      <div className="space-y-6">
        {resumeData.experience.map((job, index) => (
          <FadeIn key={index} delay={index * 0.1} direction="left">
            <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <CardTitle className="text-xl">{job.company}</CardTitle>
                    <CardDescription className="text-md font-medium mt-1 text-primary">
                      {job.role}
                    </CardDescription>
                  </div>
                  <div className="text-left md:text-right">
                    <Badge variant="outline" className="mb-1">
                      {job.date}
                    </Badge>
                    <div className="text-sm text-muted-foreground flex items-center gap-1 md:justify-end">
                       {job.location}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-outside ml-5 space-y-1 text-muted-foreground">
                  {job.points.map((point, idx) => (
                    <li key={idx} className="text-sm leading-relaxed">
                      {point}
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
