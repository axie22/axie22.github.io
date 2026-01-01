"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useSpring } from "framer-motion";

export const Navbar = () => {
    const pathname = usePathname();
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
            <div className="flex gap-4">
              <Button
                asChild
                variant={pathname === "/" ? "default" : "ghost"}
                size="sm"
                className="transition-all hover:scale-105"
              >
                <Link href="/">Home</Link>
              </Button>
              <Button
                asChild
                variant={pathname === "/about" ? "default" : "ghost"}
                size="sm"
                className="transition-all hover:scale-105"
              >
                <Link href="/about">About</Link>
              </Button>
            </div>
          </div>
          {/* Progress Bar */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-left"
            style={{ scaleX }}
          />
        </nav>
      );
};
