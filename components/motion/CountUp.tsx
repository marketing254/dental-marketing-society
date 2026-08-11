"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

/**
 * Scroll-triggered count-up. Parses a value like "500+", "+40%", "4.9★",
 * "Top 5%" or "2 CE" into an animatable number while preserving any
 * prefix/suffix text. Non-numeric values (e.g. "Free", "PACE") render as-is.
 */
export default function CountUp({
  value,
  className,
  duration = 1.6,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

  const match = value.match(/^(\D*?)(\d+(?:\.\d+)?)(.*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? parseFloat(match[2]) : NaN;
  const suffix = match?.[3] ?? "";
  const decimals = match?.[2].includes(".") ? match[2].split(".")[1].length : 0;

  // IMPORTANT: initial state is the REAL value, not 0 — this is what's in the
  // server-rendered HTML, so crawlers and AI systems (which don't run JS or
  // trigger scroll animations) read the true figure instead of "0+". The
  // count-up is purely a progressive enhancement once the span scrolls into view.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!match || isNaN(target) || !inView) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${prefix}${v.toFixed(decimals)}${suffix}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span ref={ref} className={className}>
      {match ? display : value}
    </span>
  );
}
