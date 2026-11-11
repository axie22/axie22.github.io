"use client";

import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";

const sections = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
];

export const Navbar = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <nav className="border-b bg-background/70 backdrop-blur-md sticky top-0 z-50 transition-all">
          <div className="container mx-auto px-4 max-w-4xl h-16 flex items-center justify-between">
            <div className="font-bold text-lg tracking-tight hover:text-primary transition-colors">
              <Link href="/">Alexander Xie</Link>
            </div>
            <div className="hidden sm:flex gap-6 items-center font-mono text-xs text-muted-foreground">
              {sections.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="hover:text-primary transition-colors focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-left"
            style={{ scaleX }}
          />
        </nav>
      );
};
