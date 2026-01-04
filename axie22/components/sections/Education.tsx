"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { resumeData } from "@/data/resume";
import { FadeIn } from "@/components/animations/FadeIn";

export const Education = () => {
  return (
    <section id="education" className="py-12 space-y-8">
      <FadeIn>
        <h2 className="text-3xl font-bold tracking-tight mb-6">Education</h2>
      </FadeIn>
      <div className="space-y-6">
        {resumeData.education.map((edu, index) => (
          <FadeIn key={index} delay={index * 0.1}>
            <Card className="transition-all hover:bg-muted/50 border-l-4 border-l-primary/50">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl">{edu.school}</CardTitle>
                    <CardDescription className="text-base font-medium text-foreground/80">
                      {edu.degree}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground block">
                      {edu.date}
                    </span>
                    <span className="text-sm font-medium block">
                      GPA: {edu.gpa}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground/90">
                    Coursework:
                  </span>{" "}
                  {edu.coursework}
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};
