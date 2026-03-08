"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useSpring } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export const Navbar = () => {
    const pathname = usePathname();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [dark, setDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "dark") {
            document.documentElement.classList.add("dark");
            setDark(true);
        }
    }, []);

    const toggleTheme = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
    };

    return (
        <nav className="border-b bg-background/70 backdrop-blur-md sticky top-0 z-50 transition-all">
          <div className="container mx-auto px-4 max-w-4xl h-16 flex items-center justify-between">
            <div className="font-bold text-lg tracking-tight hover:text-primary transition-colors">
              <Link href="/">Alexander Xie</Link>
            </div>
            <div className="flex gap-2 items-center">
              <Button
                asChild
                variant={pathname === "/" ? "default" : "ghost"}
                size="sm"
                className="transition-all hover:scale-105"
                aria-current={pathname === "/" ? "page" : undefined}
              >
                <Link href="/">Home</Link>
              </Button>
              <Button
                asChild
                variant={pathname === "/about" ? "default" : "ghost"}
                size="sm"
                className="transition-all hover:scale-105"
                aria-current={pathname === "/about" ? "page" : undefined}
              >
                <Link href="/about">About</Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                className="ml-1"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-left"
            style={{ scaleX }}
          />
        </nav>
      );
};
