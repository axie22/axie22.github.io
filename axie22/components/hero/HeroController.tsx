"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ALLOW_CUSTOM_PROMPT, MAX_PROMPT_TOKENS, POSTER_URL, PROMPT } from "@/lib/forward-pass/config";
import type { EngineEvents, ForwardPassEngine, StageInfo } from "@/lib/forward-pass/engine";
import { nucleus, validateConfig } from "@/lib/forward-pass/model";
import { tokenize } from "@/lib/forward-pass/tokenize";
import { Hud } from "./Hud";

// three.js never runs on the server and loads after first paint.
const ForwardPassCanvas = dynamic(() => import("./ForwardPassCanvas"), { ssr: false });

// No-WebGL fallback: show the most likely interest, finished.
const fallbackTokens = [...nucleus()[0].toks, "."];

/**
 * Client island for the hero: prompt input, animated tagline, canvas, HUD.
 * `heading` (name) renders above the tagline and `children` (links, hint) below it.
 */
export function HeroController({ heading, children }: { heading: ReactNode; children: ReactNode }) {
  const engineRef = useRef<ForwardPassEngine | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [input, setInput] = useState(PROMPT);
  const [runPrompt, setRunPrompt] = useState(PROMPT);
  const [generated, setGenerated] = useState<string[]>([]);
  const [truncated, setTruncated] = useState(false);
  const [stage, setStage] = useState<StageInfo>({ title: "—", detail: "" });
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hudVisible, setHudVisible] = useState(true);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") validateConfig().forEach((w) => console.warn(`[forward-pass] ${w}`));
  }, []);

  const events = useMemo<EngineEvents>(
    () => ({
      onStageChange: setStage,
      onTokenEmitted: (t) => setGenerated((g) => [...g, t]),
      onRunStart: (p) => {
        setRunPrompt(p);
        setGenerated([]);
        setDone(false);
      },
      onDone: () => setDone(true),
      onProgress: setProgress,
      onPlayingChange: setPlaying,
      onHudVisibleChange: setHudVisible,
    }),
    []
  );

  const onEngine = (e: ForwardPassEngine | null) => {
    engineRef.current = e;
    setReady(!!e);
  };

  const onFail = () => {
    engineRef.current?.dispose();
    engineRef.current = null;
    setReady(false);
    setFailed(true);
    setRunPrompt(PROMPT);
    setGenerated(fallbackTokens);
  };

  const run = (text: string) => {
    const n = tokenize(text).length;
    if (!n) return; // ignore empty submits
    setTruncated(n > MAX_PROMPT_TOKENS);
    engineRef.current?.start(text);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(ALLOW_CUSTOM_PROMPT ? input : PROMPT);
  };

  const onPlayPause = () => {
    const eng = engineRef.current;
    if (!eng) return;
    if (playing) eng.pause();
    else if (done) run(input);
    else eng.play();
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,#1a1f2e_0,#07090d_60%)] bg-cover bg-center"
        style={failed ? { backgroundImage: `url(${POSTER_URL})` } : undefined}
      />
      {!failed && <ForwardPassCanvas events={events} stageRef={stageRef} onEngine={onEngine} onFail={onFail} />}

      {/* Desktop: text left, scene right, HUD floating bottom-right. Mobile: text, scene band, HUD stacked. */}
      <div className="pointer-events-none relative z-10 flex h-full items-center px-[6vw] max-[800px]:h-auto max-[800px]:flex-col max-[800px]:items-stretch max-[800px]:pt-11 max-[800px]:pb-4">
        <div className="pointer-events-auto max-w-[500px]">
          <form
            onSubmit={onSubmit}
            autoComplete="off"
            className="flex items-center gap-2 rounded-lg border border-[#1c2230] bg-[rgba(10,13,19,.72)] px-3 py-2.5 font-mono text-sm text-[#8a93a6] backdrop-blur-[6px] focus-within:border-[#2a3245]"
          >
            <span className="whitespace-nowrap text-[#4cc9f0]">alex@nyc:~$</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              // don't auto re-sample while the visitor is typing
              onFocus={() => engineRef.current?.setAutoLoop(false)}
              onBlur={() => engineRef.current?.setAutoLoop(true)}
              readOnly={!ALLOW_CUSTOM_PROMPT}
              spellCheck={false}
              aria-label="Prompt fed into the model"
              className="min-w-0 flex-1 rounded-sm bg-transparent text-[#e6e9ef] outline-none focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#ffb454]"
            />
          </form>
          {truncated && (
            <p className="mt-1.5 font-mono text-[11px] text-[#8a93a6]">Only the first {MAX_PROMPT_TOKENS} tokens are used.</p>
          )}

          {heading}

          {/* Changes every run, so it's hidden from assistive tech; the prompt and subline carry the meaning. */}
          <p aria-hidden="true" className="min-h-[1.7em] font-mono text-[clamp(15px,1.7vw,19px)] leading-normal">
            {runPrompt}
            {generated.map((t, i) => (
              <span key={i} className="text-[#ffb454]">
                {t}
              </span>
            ))}
            <span className="fp-caret" />
          </p>

          {children}
        </div>

        <div ref={stageRef} aria-hidden="true" className="hidden h-[clamp(280px,40svh,400px)] max-[800px]:block" />

        {ready && !failed && (
          <Hud
            stage={stage}
            playing={playing}
            progress={progress}
            visible={hudVisible}
            onPlayPause={onPlayPause}
            onReplay={() => run(input)}
            onSeek={(p) => engineRef.current?.seek(p)}
          />
        )}
      </div>
    </>
  );
}
