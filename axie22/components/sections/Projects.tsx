"use client";

import { useRef } from "react";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resumeData, type Project } from "@/data/resume";
import { FadeIn } from "@/components/animations/FadeIn";
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight, Github, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export const Projects = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="projects" className="py-24 space-y-12">
      <FadeIn>
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl font-bold tracking-tight">Featured Projects</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              A selection of systems and applications that I've been working on recently.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="rounded-full hover:bg-muted"
              aria-label="Scroll projects left"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="rounded-full hover:bg-muted"
              aria-label="Scroll projects right"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </FadeIn>

      <div className="relative w-full">
        <div
          ref={scrollRef}
          className="overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
        >
          <div className="flex gap-6 w-max">
            {resumeData.projects.map((project: Project, index: number) => (
              <div
                key={index}
                className="w-[85vw] md:w-[350px] shrink-0 snap-center"
              >
                <FadeIn delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="h-full"
                  >
                    <SpotlightCard className="flex flex-col h-full bg-card/30 border-muted/20 backdrop-blur-xl hover:border-primary/20 transition-colors p-0 overflow-hidden group">
                      {project.image ? (
                         <div className="relative w-full aspect-[2/1] border-b border-muted/20 overflow-hidden">
                             <Image
                               src={project.image}
                               alt={project.title}
                               fill
                               className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                             />
                         </div>
                      ) : (
                        <div className="relative w-full aspect-[2/1] border-b border-muted/20 overflow-hidden bg-muted/10 flex items-center justify-center">
                            <div className="text-4xl font-bold text-muted-foreground/20 select-none">
                                {project.title.substring(0, 2).toUpperCase()}
                            </div>
                        </div>
                      )}

                      <div className="flex flex-col flex-grow p-5">
                          <CardHeader className="p-0 space-y-3 mb-3">
                          <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                  <CardTitle className="text-xl font-bold tracking-tight">{project.title}</CardTitle>
                                  <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                                      {project.date}
                                  </p>
                              </div>
                              <div className="flex gap-1">
                                {project.github && (
                                    <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors">
                                        <Link
                                          href={project.github}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          aria-label={`View ${project.title} on GitHub`}
                                        >
                                            <Github className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                )}
                                {project.link && (
                                    <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors">
                                        <Link
                                          href={project.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          aria-label={`View ${project.title} live deployment`}
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                )}
                              </div>
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
                          <CardContent className="p-0 flex-grow space-y-3">
                          <div className="space-y-1.5">
                              {project.points.map((point, idx) => (
                              <div key={idx} className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed group/item">
                                  <div className="mt-1.5 shrink-0 h-1.5 w-1.5 rounded-full bg-primary/40 group-hover/item:bg-primary transition-colors" />
                                  <span className="text-foreground/80 line-clamp-2">{point}</span>
                              </div>
                              ))}
                          </div>
                          </CardContent>
                          {project.link && (
                              <CardFooter className="p-0 pt-4 mt-auto">
                                  <Button asChild variant="link" className="p-0 h-auto font-semibold text-primary group-hover:underline-offset-4 decoration-primary/30">
                                      <Link href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm">
                                          View Deployment <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                      </Link>
                                  </Button>
                              </CardFooter>
                          )}
                      </div>
                    </SpotlightCard>
                  </motion.div>
                </FadeIn>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
