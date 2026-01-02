"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resumeData } from "@/data/resume";
import { FadeIn } from "@/components/animations/FadeIn";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";

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
              <Card className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300 border-muted-foreground/10 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="h-2 w-full bg-gradient-to-r from-primary/50 to-purple-500/50" />
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
                    <span className="text-xs text-muted-foreground whitespace-nowrap font-mono mt-1">
                      {project.date}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-[10px] hover:bg-primary/20 transition-colors">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-muted-foreground leading-relaxed">
                    {project.points.map((point, idx) => (
                      <li key={idx}>
                         <span className="text-foreground/90">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                 {/* Only render Footer if a link exists (or github if we had it, assuming link for now) */}
                 {/* The resume data interface doesn't strictly have 'link' typed yet but we added it to the object.
                     We can cast or just rely on JS flexibility here since it's a TS file but simple usage. 
                     Ideally we update the type definition but for now this works. */}
                { (project as any).link && (
                    <CardFooter className="pt-0">
                        <Button asChild variant="outline" size="sm" className="w-full gap-2 group">
                            <Link href={(project as any).link} target="_blank" rel="noopener noreferrer">
                                View Live Project
                                <ExternalLink className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </Link>
                        </Button>
                    </CardFooter>
                )}
              </Card>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};
