"use client";

import { useEffect, useRef, type RefObject } from "react";
import { D_DESKTOP, D_MOBILE, MAX_DPR, PROMPT } from "@/lib/forward-pass/config";
import { ForwardPassEngine, isMobileWidth, type EngineEvents } from "@/lib/forward-pass/engine";

type DevHandle = { engine: ForwardPassEngine; seek(p01: number): void; start(prompt: string, forceInterest?: number): boolean; snapshot(): string };

declare global {
  interface Window {
    __fp?: DevHandle;
  }
}

const isDev = process.env.NODE_ENV !== "production";

interface ForwardPassCanvasProps {
  events: EngineEvents;
  /** Mobile scene band; see EngineOptions.stageEl. */
  stageRef: RefObject<HTMLElement | null>;
  onEngine(engine: ForwardPassEngine | null): void;
  /** WebGL unavailable or the context was lost: show the poster instead. */
  onFail(): void;
}

export default function ForwardPassCanvas({ events, stageRef, onEngine, onFail }: ForwardPassCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // The engine holds one events object for its lifetime; route through a ref so props can change.
  const propsRef = useRef({ events, onEngine, onFail });
  useEffect(() => {
    propsRef.current = { events, onEngine, onFail };
  });

  useEffect(() => {
    const container = containerRef.current!;
    const canvas = canvasRef.current!;
    let engine: ForwardPassEngine | null = null;
    let cancelled = false;
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReduceChange = () => engine?.setReducedMotion(reduceMq.matches);

    const proxy: EngineEvents = {
      onStageChange: (s) => propsRef.current.events.onStageChange(s),
      onTokenEmitted: (t) => propsRef.current.events.onTokenEmitted(t),
      onRunStart: (p) => propsRef.current.events.onRunStart(p),
      onDone: () => propsRef.current.events.onDone(),
      onProgress: (p) => propsRef.current.events.onProgress?.(p),
      onPlayingChange: (v) => propsRef.current.events.onPlayingChange?.(v),
      onHudVisibleChange: (v) => propsRef.current.events.onHudVisibleChange?.(v),
      onContextLost: () => propsRef.current.onFail(),
    };

    (async () => {
      // Labels are drawn into 2D canvases, so the (hashed next/font) family must be loaded first.
      const family = getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim() || "ui-monospace, monospace";
      try {
        await document.fonts.load(`500 64px ${family}`);
        await document.fonts.ready;
      } catch {}
      if (cancelled) return;

      const mobile = isMobileWidth();
      // Dev-only: ?fp=final renders the final state; &fpi=<index> pins the sampled interest.
      const params = new URLSearchParams(window.location.search);
      const finalOnly = isDev && params.get("fp") === "final";
      const forceInterest = isDev && params.has("fpi") ? Number(params.get("fpi")) : undefined;
      try {
        engine = new ForwardPassEngine(canvas, proxy, {
          container,
          stageEl: stageRef.current,
          fontFamily: `${family}, ui-monospace, monospace`,
          dims: mobile ? D_MOBILE : D_DESKTOP,
          maxDpr: mobile ? MAX_DPR.mobile : MAX_DPR.desktop,
          reducedMotion: reduceMq.matches,
          finePointer: window.matchMedia("(pointer: fine)").matches,
          finalOnly,
        });
      } catch (err) {
        if (isDev) console.warn("[forward-pass] WebGL unavailable, showing poster.", err);
        propsRef.current.onFail();
        return;
      }
      reduceMq.addEventListener("change", onReduceChange);
      propsRef.current.onEngine(engine);
      engine.start(PROMPT, forceInterest);
      if (isDev) {
        const e = engine;
        window.__fp = { engine: e, seek: (p) => e.seek(p), start: (p, i) => e.start(p, i), snapshot: () => e.snapshot() };
      }
    })();

    return () => {
      cancelled = true;
      reduceMq.removeEventListener("change", onReduceChange);
      if (engine) {
        engine.dispose();
        propsRef.current.onEngine(null);
        if (isDev && window.__fp?.engine === engine) delete window.__fp;
      }
    };
  }, [stageRef]);

  return (
    <div ref={containerRef} className="absolute inset-0" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-pan-y pointer-fine:cursor-grab pointer-fine:active:cursor-grabbing"
      />
    </div>
  );
}
