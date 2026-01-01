"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string | string[];
  delay?: number;
  className?: string;
  cursor?: boolean;
}

export const Typewriter = ({
  text,
  delay = 0,
  className,
  cursor = true,
}: TypewriterProps) => {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const textArray = Array.isArray(text) ? text : [text];
  const currentText = textArray[textIndex];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let i = 0;

    const type = () => {
      setDisplayText(currentText.substring(0, i + 1));
      i++;

      if (i < currentText.length) {
        timeout = setTimeout(type, 50 + Math.random() * 50); // Random typing speed
      } else if (textArray.length > 1) {
        setTimeout(() => {
            // Optional: Logic to delete and type next word could go here
            // For now, let's just stick to typing once or cycling simplistically if needed
            // But for this use case (Role), static typing once is usually better or full delete content
        }, 2000);
      }
    };

    setTimeout(() => {
        type();
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [currentText, delay]);

  // Cursor blink
  const [cursorVisible, setCursorVisible] = useState(true);
  useEffect(() => {
    if (!cursor) return;
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, [cursor]);

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <span
          className={`${cursorVisible ? "opacity-100" : "opacity-0"} ml-0.5 text-primary`}
        >
          |
        </span>
      )}
    </span>
  );
};
