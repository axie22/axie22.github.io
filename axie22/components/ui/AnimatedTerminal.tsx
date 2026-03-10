"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const PROMPT = "alex@nyc:~$ ";

const BLOCKS = [
  {
    command: "whoami",
    output: ["Alexander Xie · Software Engineer"],
  },
  {
    command: "cat bio.txt",
    output: [
      "Senior at NYU · CS + Data Science · 2026",
      "Building systems and tools people depend on.",
    ],
  },
  {
    command: "ls experience/",
    output: ["amazon/   colai/   fortinet/   nyu/"],
  },
  {
    command: "git log --oneline",
    output: [
      "shipped Orbit — real-time AI interviewer",
      "interned @ Amazon — 93% faster config setup",
      "ML research @ ColAI — 50% ETL runtime cut",
      "patched 400+ vulns @ Fortinet",
    ],
  },
  {
    command: "echo $STATUS",
    output: ["open to new opportunities"],
  },
];

type Line =
  | { kind: "command"; text: string }
  | { kind: "output"; text: string }
  | { kind: "blank" };

interface AnimatedTerminalProps {
  className?: string;
  title?: string;
}

export function AnimatedTerminal({
  className,
  title = "~/.profile",
}: AnimatedTerminalProps) {
  const [lines, setLines] = useState<Line[]>([]);
  const [typingCmd, setTypingCmd] = useState<string>("");
  const [isDone, setIsDone] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) =>
      new Promise<void>((r) => setTimeout(r, ms));

    async function run() {
      for (let i = 0; i < BLOCKS.length; i++) {
        const { command, output } = BLOCKS[i];

        // Type command character by character
        for (let j = 1; j <= command.length; j++) {
          if (cancelled) return;
          setTypingCmd(command.slice(0, j));
          await sleep(44);
        }

        await sleep(360);
        if (cancelled) return;

        setLines((prev) => [...prev, { kind: "command", text: command }]);
        setTypingCmd("");

        for (const line of output) {
          await sleep(80);
          if (cancelled) return;
          setLines((prev) => [...prev, { kind: "output", text: line }]);
        }

        if (i < BLOCKS.length - 1) {
          await sleep(180);
          if (cancelled) return;
          setLines((prev) => [...prev, { kind: "blank" }]);
          await sleep(160);
        }
      }

      if (!cancelled) setIsDone(true);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-zinc-950 font-mono text-sm shadow-xl",
        className
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/50 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-2 text-xs text-zinc-400">{title}</span>
      </div>

      {/* Terminal body */}
      <div className="p-4 text-xs leading-relaxed overflow-x-auto min-h-[220px]">
        {lines.map((line, i) =>
          line.kind === "blank" ? (
            <div key={i} className="h-3.5" />
          ) : line.kind === "command" ? (
            <div key={i} className="flex">
              <span className="text-green-400 shrink-0 select-none">
                {PROMPT}
              </span>
              <span className="text-zinc-100">{line.text}</span>
            </div>
          ) : (
            <div key={i} className="text-zinc-400 pl-0">
              {line.text}
            </div>
          )
        )}

        {/* Active typing line */}
        {!isDone && (
          <div className="flex">
            <span className="text-green-400 shrink-0 select-none">
              {PROMPT}
            </span>
            <span className="text-zinc-100">{typingCmd}</span>
            <span
              className="inline-block w-[7px] h-[13px] ml-px bg-zinc-100 translate-y-[1px]"
              style={{ opacity: cursorOn ? 1 : 0 }}
            />
          </div>
        )}

        {/* Idle cursor after done */}
        {isDone && (
          <div className="flex mt-1">
            <span className="text-green-400 shrink-0 select-none">
              {PROMPT}
            </span>
            <span
              className="inline-block w-[7px] h-[13px] ml-px bg-zinc-100 translate-y-[1px]"
              style={{ opacity: cursorOn ? 1 : 0 }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
