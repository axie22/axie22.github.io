"use client";

import { Button } from "@/components/ui/button";
import { resumeData } from "@/data/resume";
import { Github, Linkedin, FileText, Mail } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { motion } from "framer-motion";
import { Typewriter } from "@/components/ui/Typewriter";
import { CodeWindow } from "@/components/ui/CodeWindow";

export const Hero = () => {
  return (
    <section className="min-h-[85vh] flex flex-col lg:flex-row justify-center items-center gap-12 pt-24 pb-12 relative">
      <div className="flex-1 flex flex-col justify-center items-start text-left space-y-6">
          <FadeIn delay={0.1}>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                <span className="text-foreground">{resumeData.personalInfo.name}</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="text-2xl font-semibold text-muted-foreground h-8 flex items-center">
                <Typewriter text={resumeData.personalInfo.role} />
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-[600px]">
              {resumeData.personalInfo.bio}
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="rounded-full shadow-lg hover:scale-105 transition-transform">
                <a
                  href="/Alexander_Xie_resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="mr-2 h-5 w-5" /> Resume
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full hover:bg-secondary/50 hover:scale-105 transition-transform">
                <a
                  href={resumeData.personalInfo.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-5 w-5" /> GitHub
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full hover:bg-secondary/50 hover:scale-105 transition-transform">
                <a
                  href={resumeData.personalInfo.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="mr-2 h-5 w-5" /> LinkedIn
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full hover:bg-secondary/50 hover:scale-105 transition-transform">
                <a href={`mailto:${resumeData.personalInfo.contact.email}`}>
                  <Mail className="mr-2 h-5 w-5" /> Contact
                </a>
              </Button>
            </div>
          </FadeIn>
      </div>

      <div className="flex-1 w-full max-w-[500px] hidden lg:block">
        <FadeIn delay={0.5}>
            <CodeWindow className="w-full" title="~/.profile">
                <pre className="text-xs leading-relaxed">
                    <code>
{`alex@nyc:~$ whoami
Alexander Xie · Software Engineer

alex@nyc:~$ cat bio.txt
Senior at NYU · CS + Data Science · 2026
Building systems and tools people depend on.

alex@nyc:~$ ls experience/
amazon/   colai/   fortinet/   nyu/

alex@nyc:~$ git log --oneline
shipped Orbit — real-time AI interviewer
interned @ Amazon — 93% faster config setup
ML research @ ColAI — 50% ETL runtime cut
patched 400+ vulns @ Fortinet

alex@nyc:~$ echo $STATUS
open to new opportunities`}
                    </code>
                </pre>
            </CodeWindow>
        </FadeIn>
      </div>
    </section>
  );
};
