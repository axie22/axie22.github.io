import { Badge } from "@/components/ui/badge";
import { resumeData } from "@/data/resume";

export const Skills = () => {
  return (
    <section id="skills" className="py-12 space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Languages</h3>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.languages.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Dev Tools & Frameworks</h3>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.devTools.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Cloud & DevOps</h3>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.cloudDevOps.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Certifications</h3>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.certifications.map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
