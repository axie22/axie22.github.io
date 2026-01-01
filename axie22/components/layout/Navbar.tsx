"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-4xl h-16 flex items-center justify-between">
        <div className="font-bold text-lg tracking-tight">
          <Link href="/">Alexander Xie</Link>
        </div>
        <div className="flex gap-4">
          <Button
            asChild
            variant={pathname === "/" ? "default" : "ghost"}
            size="sm"
          >
            <Link href="/">Home</Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/about" ? "default" : "ghost"}
            size="sm"
          >
            <Link href="/about">About</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};
