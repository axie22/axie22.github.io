"use client";

import { cn } from "@/lib/utils";
import type { StageInfo } from "@/lib/forward-pass/engine";

interface HudProps {
  stage: StageInfo;
  playing: boolean;
  progress: number;
  visible: boolean;
  onPlayPause(): void;
  onReplay(): void;
  onSeek(p01: number): void;
}

const btn =
  "rounded-[5px] border border-[#232b3b] bg-[#121722] px-[9px] py-1 text-[#e6e9ef] hover:border-[#8a93a6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb454]";

export function Hud({ stage, playing, progress, visible, onPlayPause, onReplay, onSeek }: HudProps) {
  return (
    <aside
      aria-label="Forward pass controls"
      className={cn(
        "absolute right-5 bottom-5 z-20 w-[300px] rounded-[10px] border border-[#1c2230] bg-[rgba(10,13,19,.82)] px-3.5 py-3 font-mono text-xs text-[#e6e9ef] backdrop-blur-[6px] transition-opacity duration-300",
        "pointer-events-auto max-[800px]:relative max-[800px]:right-auto max-[800px]:bottom-auto max-[800px]:w-auto",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div className="min-h-[1.3em]">{stage.title}</div>
      <div className="mt-1 min-h-[3.9em] text-[11px] leading-[1.35] text-[#8a93a6] max-[800px]:min-h-0">{stage.detail}</div>
      <div className="mt-2 flex items-center gap-1.5">
        <button type="button" className={btn} onClick={onPlayPause}>
          {playing ? "Pause" : "Play"}
        </button>
        <button type="button" className={btn} onClick={onReplay}>
          Replay
        </button>
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(progress * 1000)}
          onChange={(e) => onSeek(Number(e.target.value) / 1000)}
          aria-label="Scrub through the forward pass"
          className="min-w-0 flex-1 accent-[#ffb454] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb454]"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-2.5 text-[10px] text-[#8a93a6]">
        <span><i className="mr-1 inline-block size-2 rounded-[2px] bg-[#ffb454]" />+ activation</span>
        <span><i className="mr-1 inline-block size-2 rounded-[2px] bg-[#4cc9f0]" />− activation</span>
        <span><i className="mr-1 inline-block size-2 rounded-[2px] bg-[#b388ff]" />attention</span>
        <span className="opacity-80">toy model · simulated activations</span>
      </div>
    </aside>
  );
}
