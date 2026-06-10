"use client";

import { motion } from "framer-motion";

/**
 * Lightweight, GPU-friendly hero backdrop for the inner pages — a slowly
 * rotating conic light-beam, a drifting perspective grid, two parallax
 * coral/teal glows and a few floating sparks. Deliberately *different* from
 * the home page's 3D orb so each surface feels distinct.
 */
export default function BeamField({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      {/* Perspective grid, faded toward the edges */}
      <div
        className="absolute inset-0 opacity-[0.16] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
        }}
      />

      {/* Rotating conic beam */}
      <motion.div
        className="absolute left-1/2 top-[-38%] h-[88vh] w-[88vh] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(242,107,58,0.20), rgba(37,174,203,0.16), rgba(242,107,58,0.04), rgba(37,174,203,0.16), rgba(242,107,58,0.20))",
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 44, ease: "linear" }}
      />

      {/* Drifting coral glow */}
      <motion.div
        className="aurora-blob left-[-12%] top-[6%] h-[44vh] w-[42vw]"
        style={{ background: "rgba(242,107,58,0.18)" }}
        animate={{ x: [0, 60, 0], y: [0, 26, 0] }}
        transition={{ repeat: Infinity, duration: 19, ease: "easeInOut" }}
      />
      {/* Drifting teal glow */}
      <motion.div
        className="aurora-blob right-[-10%] top-[-6%] h-[40vh] w-[38vw]"
        style={{ background: "rgba(37,174,203,0.16)" }}
        animate={{ x: [0, -54, 0], y: [0, 40, 0] }}
        transition={{ repeat: Infinity, duration: 24, ease: "easeInOut" }}
      />

      {/* Floating sparks */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-gold-300/80"
          style={{
            left: `${14 + i * 17}%`,
            top: `${28 + (i % 3) * 16}%`,
            boxShadow: "0 0 12px 2px rgba(253,183,143,0.5)",
          }}
          animate={{ y: [0, -18, 0], opacity: [0.25, 1, 0.25] }}
          transition={{
            repeat: Infinity,
            duration: 3 + i * 0.6,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}

      {/* Bottom fade into the page */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950 to-transparent" />
    </div>
  );
}
