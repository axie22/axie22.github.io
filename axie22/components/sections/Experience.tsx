import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { resumeData } from "@/data/resume";

export const Experience = () => {
  return (
    <section id="experience" className="py-12 space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Experience</h2>
      <div className="space-y-6">
        {resumeData.experience.map((job, index) => (
          <Card key={index} className="border-l-4 border-l-primary shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{job.company}</CardTitle>
                  <CardDescription className="text-md font-medium mt-1">
                    {job.role}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1">
                    {job.date}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
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
        ))}
      </div>
    </section>
  );
};
