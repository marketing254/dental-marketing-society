"use client";

import { motion } from "framer-motion";

/**
 * Elegant background of curved "ribbon" lines that sweep in from BOTH sides and
 * frame the centred hero content. Soft slate base curves plus a few gold
 * highlights whose dashes travel along the path ("running" lines). The right
 * side is a mirror of the left, so the framing is symmetric.
 */
const CURVES = [
  "M-90 -20 C 380 70, 560 300, 360 560 S 190 780, 470 860",
  "M-90 90 C 440 160, 620 360, 430 620 S 250 840, 540 920",
  "M-130 30 C 320 90, 470 270, 320 520 S 190 760, 430 840",
  "M-90 200 C 500 250, 690 440, 500 700 S 320 900, 620 980",
  "M-130 130 C 360 180, 520 360, 380 600",
];

const HIGHLIGHTS = [
  { d: CURVES[1], w: 2, dash: "2 26", dur: 8 },
  { d: CURVES[3], w: 1.5, dash: "2 30", dur: 11 },
];

function SideGroup({ drift }: { drift: number }) {
  return (
    <motion.g
      animate={{ y: [0, drift, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
    >
      {CURVES.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="#9fb0c5"
          strokeOpacity={0.13}
          strokeWidth={1}
        />
      ))}
      {HIGHLIGHTS.map((h, i) => (
        <motion.path
          key={`h-${i}`}
          d={h.d}
          fill="none"
          stroke="url(#flGold)"
          strokeWidth={h.w}
          strokeLinecap="round"
          strokeDasharray={h.dash}
          animate={{ strokeDashoffset: [0, -300] }}
          transition={{ duration: h.dur, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </motion.g>
  );
}

export default function FlowLines({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 760"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="flGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f0d489" stopOpacity="0" />
            <stop offset="0.5" stopColor="#e8c45c" stopOpacity="0.9" />
            <stop offset="1" stopColor="#d4a82f" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Left ribbons */}
        <g>
          <SideGroup drift={-12} />
        </g>

        {/* Right ribbons (mirror of the left) */}
        <g transform="translate(1440,0) scale(-1,1)">
          <SideGroup drift={12} />
        </g>
      </svg>

      {/* Fade into the page */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950 to-transparent" />
    </div>
  );
}
