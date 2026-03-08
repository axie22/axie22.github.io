"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(120, 50, 255, 0.15)",
  ...props
}: SpotlightCardProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !spotlightRef.current) return;
    cancelAnimationFrame(rafRef.current);
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    rafRef.current = requestAnimationFrame(() => {
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${spotlightColor}, transparent 40%)`;
      }
    });
  };

  const handleMouseEnter = () => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
  };

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300",
        className
      )}
      {...props}
    >
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{ opacity: 0 }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
};
