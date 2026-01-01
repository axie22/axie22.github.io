import { Button } from "@/components/ui/button";
import { resumeData } from "@/data/resume";
import { Github, Linkedin, FileText, Mail } from "lucide-react";

export const Hero = () => {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-start text-left space-y-6 pt-24 pb-12">
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
          {resumeData.personalInfo.name}
        </h1>
        <h2 className="text-2xl font-semibold text-muted-foreground">
          {resumeData.personalInfo.role}
        </h2>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-[600px]">
          {resumeData.personalInfo.bio}
        </p>
      </div>

      <div className="flex flex-wrap gap-4 pt-4">
        <Button asChild size="lg" className="rounded-full">
          <a
            href="/Alexander_Xie_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileText className="mr-2 h-5 w-5" /> Resume
          </a>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <a
            href={resumeData.personalInfo.contact.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="mr-2 h-5 w-5" /> GitHub
          </a>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <a
            href={resumeData.personalInfo.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="mr-2 h-5 w-5" /> LinkedIn
          </a>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <a href={`mailto:${resumeData.personalInfo.contact.email}`}>
            <Mail className="mr-2 h-5 w-5" /> Contact
          </a>
        </Button>
      </div>
    </section>
  );
};
