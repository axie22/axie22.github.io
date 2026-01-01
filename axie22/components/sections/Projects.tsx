"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { resumeData } from "@/data/resume";
import { FadeIn } from "@/components/animations/FadeIn";
import { motion } from "framer-motion";

export const Projects = () => {
  return (
    <section id="projects" className="py-12 space-y-8">
      <FadeIn>
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
      </FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumeData.projects.map((project, index) => (
          <FadeIn key={index} delay={index * 0.1}>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="h-full"
            >
              <Card className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300 border-muted-foreground/10 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <span className="text-xs text-muted-foreground whitespace-nowrap font-mono">
                      {project.date}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-[10px] hover:bg-primary/20 transition-colors">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-muted-foreground">
                    {project.points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};
