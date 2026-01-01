import { resumeData } from "@/data/resume";

export const About = () => {
  return (
    <section id="about" className="py-12 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">About</h2>
      <p className="text-lg text-muted-foreground leading-relaxed">
        {resumeData.personalInfo.bio}
      </p>
      
      {/* Education included in About for compactness, or could be separate */}
      <div className="pt-4">
        <h3 className="text-xl font-semibold mb-2">Education</h3>
        {resumeData.education.map((edu, index) => (
          <div key={index} className="flex flex-col md:flex-row justify-between mb-4 bg-muted/30 p-4 rounded-lg">
            <div>
              <div className="font-semibold">{edu.school}</div>
              <div className="text-sm text-muted-foreground">{edu.degree}</div>
            </div>
            <div className="text-right">
                <div className="text-sm font-medium">{edu.date}</div>
                <div className="text-sm text-muted-foreground">GPA: {edu.gpa}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
