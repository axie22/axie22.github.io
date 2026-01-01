"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export const FadeIn = ({
  children,
  className,
  delay = 0,
  direction = "up",
}: FadeInProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const directionOffset =
    direction === "up"
      ? 40
      : direction === "down"
      ? -40
      : direction === "left"
      ? 40
      : direction === "right"
      ? -40
      : 0;

  const axis = direction === "left" || direction === "right" ? "x" : "y";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, [axis]: directionOffset }}
      animate={isInView ? { opacity: 1, [axis]: 0 } : { opacity: 0, [axis]: directionOffset }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
