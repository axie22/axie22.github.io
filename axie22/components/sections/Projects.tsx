import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { resumeData } from "@/data/resume";

export const Projects = () => {
  return (
    <section id="projects" className="py-12 space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumeData.projects.map((project, index) => (
          <Card key={index} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {project.date}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-[10px]">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-muted-foreground">
                {project.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
