"use client";

import { cn } from "@/lib/utils";

interface CodeWindowProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function CodeWindow({ children, className, title = "profile.json" }: CodeWindowProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border bg-zinc-950 font-mono text-sm shadow-xl", className)}>
      <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/50 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <div className="ml-2 text-xs text-zinc-400">{title}</div>
      </div>
      <div className="p-4 overflow-x-auto text-zinc-300">
        {children}
      </div>
    </div>
  );
}
