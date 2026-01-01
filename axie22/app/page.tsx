import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-sans antialiased">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Hero />
        <Separator className="my-8" />
        <About />
        <Separator className="my-8" />
        <Experience />
        <Separator className="my-8" />
        <Projects />
        <Separator className="my-8" />
        <Skills />
        
        <footer className="py-12 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Alexander Xie. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
