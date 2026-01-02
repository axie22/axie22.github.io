"use client";

import {
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
import { ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export const Projects = () => {
  return (
    <section id="projects" className="py-24 space-y-12">
      <FadeIn>
        <div className="flex flex-col gap-4">
            <h2 className="text-4xl font-bold tracking-tight">Featured Projects</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
                A selection of systems and applications I've engineered, focusing on scalability, real-time interactions, and machine learning infrastructure.
            </p>
        </div>
      </FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resumeData.projects.map((project, index) => (
          <FadeIn key={index} delay={index * 0.1}>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="h-full"
            >
              <SpotlightCard className="flex flex-col h-full bg-card/30 border-muted/20 backdrop-blur-xl hover:border-primary/20 transition-colors p-0 overflow-hidden">
                {/* Image Section */}
                { (project as any).image && (
                   <div className="relative w-full aspect-[16/10] border-b border-muted/20 overflow-hidden">
                       <Image 
                         src={(project as any).image} 
                         alt={project.title}
                         fill
                         className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                       />
                   </div>
                )}

                <div className="flex flex-col flex-grow p-6">
                    <CardHeader className="p-0 space-y-4 mb-4">
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-bold tracking-tight">{project.title}</CardTitle>
                            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                {project.date}
                            </p>
                        </div>
                        { (project as any).link && (
                            <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors">
                                <Link href={(project as any).link} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-5 w-5" />
                                </Link>
                            </Button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                        <Badge 
                            key={tech} 
                            variant="secondary" 
                            className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/10 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-none font-medium transition-colors"
                        >
                            {tech}
                        </Badge>
                        ))}
                    </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-grow space-y-4">
                    <div className="space-y-2">
                        {project.points.map((point, idx) => (
                        <div key={idx} className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed group/item">
                            <div className="mt-1.5 shrink-0 h-1.5 w-1.5 rounded-full bg-primary/40 group-hover/item:bg-primary transition-colors" />
                            <span className="text-foreground/80">{point}</span>
                        </div>
                        ))}
                    </div>
                    </CardContent>
                    {/* Optional Footer Action */}
                    { (project as any).link && (
                        <CardFooter className="p-0 pt-6 mt-auto">
                            <Button asChild variant="link" className="p-0 h-auto font-semibold text-primary group-hover:underline-offset-4 decoration-primary/30" >
                                <Link href={(project as any).link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    View Deployment <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </CardFooter>
                    )}
                </div>
              </SpotlightCard>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};
