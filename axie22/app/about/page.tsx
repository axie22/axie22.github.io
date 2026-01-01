import { resumeData } from "@/data/resume";
import { FadeIn } from "@/components/animations/FadeIn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl min-h-screen space-y-16">
      
      {/* Intro Section */}
      <section className="space-y-6">
        <FadeIn>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary leading-tight">
            {resumeData.aboutPage.title}
          </h1>
        </FadeIn>
        <div className="space-y-4 text-lg text-muted-foreground leading-relaxed max-w-2xl">
          {resumeData.aboutPage.bio.map((paragraph, idx) => (
            <FadeIn key={idx} delay={0.1 * (idx + 1)}>
              <p>{paragraph}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      <Separator />

      {/* Focus Areas */}
      <section className="space-y-8">
        <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight">Focus Areas</h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resumeData.aboutPage.philosophy.map((item, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      <Separator />

      {/* Education */}
      <section className="space-y-8">
         <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight">Education</h2>
         </FadeIn>
          {resumeData.education.map((edu, index) => (
            <FadeIn key={index} delay={0.1}>
                <div className="flex flex-col md:flex-row justify-between p-6 bg-secondary/20 rounded-lg border border-border">
                    <div>
                        <h3 className="text-xl font-semibold">{edu.school}</h3>
                        <p className="text-lg text-primary font-medium">{edu.degree}</p>
                    </div>
                    <div className="md:text-right mt-2 md:mt-0">
                        <div className="font-mono text-sm text-muted-foreground">{edu.date}</div>
                        <div className="font-semibold">GPA: {edu.gpa}</div>
                    </div>
                </div>
                <div className="mt-4 pl-2 border-l-2 border-primary/20">
                     <p className="text-sm text-muted-foreground italic">
                        Relevant Coursework: {edu.coursework}
                     </p>
                </div>
            </FadeIn>
          ))}
      </section>

    </main>
  );
}
