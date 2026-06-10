"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";

const easeOut = [0.22, 1, 0.36, 1] as const;

const AVATARS = [
  { src: "/assets/speaker-nicole.jpg", name: "Nicole Toudouze" },
  { src: "/assets/speaker-lori.jpg", name: "Lori A. Parr" },
  { src: "/assets/speaker-michael.jpg", name: "Dr. Michael Goldberg" },
  { src: "/assets/speaker-vaheed.jpg", name: "Dr. Vaheed Shahnam" },
];

// Rising-bar data for the mini growth chart
const BARS = [38, 52, 46, 64, 72, 86, 100];

/**
 * First-class hero visual — a glass "growth dashboard" panel with crisp speaker
 * avatars, an animated rising-bar chart, stat tiles, an orbiting ring, a looping
 * shine sweep and floating brand chips. Vector/CSS based, so it stays razor sharp
 * at any size. Replaces the old webinar-registration card.
 */
export default function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Soft brand glow */}
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-coral-500/25 via-transparent to-teal-400/20 blur-3xl"
      />

      {/* Orbiting rings */}
      <div
        aria-hidden
        className="animate-spin-slower absolute left-1/2 top-1/2 -z-10 h-[122%] w-[122%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/12"
      />
      <div
        aria-hidden
        className="animate-spin-slow absolute left-1/2 top-1/2 -z-10 h-[92%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-coral-400/20"
      />

      {/* Main glass dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 36, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -1.4 }}
        transition={{ duration: 0.9, ease: easeOut, delay: 0.3 }}
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="glass-strong relative overflow-hidden !rounded-[1.8rem] p-6"
        >
          {/* Shine sweep */}
          <span
            aria-hidden
            className="animate-shine pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/12 to-transparent"
          />

          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-ivory">
              <span className="live-dot" /> Live this month
            </span>
            <span className="chip chip-gold">
              <Icon name="award" size={13} /> PACE CE
            </span>
          </div>

          {/* Growth chart */}
          <div className="mt-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-mono text-[0.65rem] tracking-[0.2em] text-mist uppercase">
                  New patients booked
                </p>
                <p className="font-display text-3xl font-semibold text-ivory">
                  +40%{" "}
                  <span className="align-middle text-sm font-bold text-teal-400">
                    ▲ growing
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-4 flex h-28 items-end gap-2.5">
              {BARS.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: `${h}%`, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.6 + i * 0.08, ease: easeOut }}
                  className={`flex-1 rounded-t-md ${
                    i === BARS.length - 1
                      ? "bg-gradient-to-t from-coral-600 to-coral-400"
                      : "bg-gradient-to-t from-teal-500/40 to-teal-400/70"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Speakers row */}
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {AVATARS.map((a) => (
                  <Image
                    key={a.src}
                    src={a.src}
                    alt={a.name}
                    width={40}
                    height={40}
                    className="h-9 w-9 rounded-full border-2 border-navy-900 object-cover"
                  />
                ))}
              </div>
              <div className="leading-tight">
                <b className="block text-sm text-ivory">Expert speakers</b>
                <small className="text-[0.7rem] text-mist">Industry leaders, live</small>
              </div>
            </div>
            <div className="text-coral-400">
              <Icon name="users" size={20} />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating chip — CE credits */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.85 }}
        className="absolute -left-5 top-12 sm:-left-10"
      >
        <motion.div
          animate={{ y: [0, -9, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="glass-strong flex items-center gap-2.5 !rounded-2xl px-4 py-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-coral-400 to-coral-600 text-navy-950">
            <Icon name="award" size={18} />
          </span>
          <span className="leading-tight">
            <b className="block text-sm text-ivory">2 CE Credits</b>
            <small className="text-[0.7rem] text-mist">Earned live</small>
          </span>
        </motion.div>
      </motion.div>

      {/* Floating chip — replay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.05 }}
        className="absolute -right-3 bottom-8 sm:-right-9"
      >
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut" }}
          className="glass-strong flex items-center gap-2.5 !rounded-2xl px-4 py-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-teal-500 text-navy-950">
            <Icon name="replay" size={18} />
          </span>
          <span className="leading-tight">
            <b className="block text-sm text-ivory">Free replay</b>
            <small className="text-[0.7rem] text-mist">For all sign-ups</small>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
