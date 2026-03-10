"use client";

import { resumeData } from "@/data/resume";
import { FadeIn } from "@/components/animations/FadeIn";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

// Maps skill names to their devicon CDN path (folder/file without .svg)
const DEVICON: Record<string, string> = {
  "C++": "cplusplus/cplusplus-original",
  Python: "python/python-original",
  TypeScript: "typescript/typescript-original",
  Go: "go/go-original",
  Java: "java/java-original",
  C: "c/c-original",
  JavaScript: "javascript/javascript-original",
  PyTorch: "pytorch/pytorch-original",
  TensorFlow: "tensorflow/tensorflow-original",
  React: "react/react-original",
  "Node.js": "nodejs/nodejs-original",
  OpenCV: "opencv/opencv-original",
  Pandas: "pandas/pandas-original",
  "Scikit-learn": "scikitlearn/scikitlearn-original",
  Linux: "linux/linux-original",
  Bash: "bash/bash-original",
  AWS: "amazonwebservices/amazonwebservices-plain-wordmark",
  Docker: "docker/docker-original",
  PostgreSQL: "postgresql/postgresql-original",
  "Google Cloud": "googlecloud/googlecloud-original",
  Redis: "redis/redis-original",
  MongoDB: "mongodb/mongodb-original",
};

function deviconUrl(slug: string) {
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}.svg`;
}

function SkillCard({ name }: { name: string }) {
  const slug = DEVICON[name];

  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-card/40 hover:bg-card/80 hover:border-primary/30 hover:shadow-sm transition-all duration-200 group cursor-default">
      {slug ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={deviconUrl(slug)}
          alt={name}
          width={32}
          height={32}
          className="w-8 h-8 object-contain"
        />
      ) : (
        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
          <span className="text-[10px] font-bold text-primary leading-none text-center">
            {name.substring(0, 3).toUpperCase()}
          </span>
        </div>
      )}
      <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight font-medium">
        {name}
      </span>
    </div>
  );
}

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

      <div className="space-y-10">
        {SKILL_GROUPS.map(({ label, key }, groupIdx) => (
          <FadeIn key={key} delay={groupIdx * 0.1}>
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-mono">
                {label}
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {resumeData.skills[key].map((skill) => (
                  <SkillCard key={skill} name={skill} />
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
