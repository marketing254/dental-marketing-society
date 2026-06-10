"use client";

import dynamic from "next/dynamic";

// The three.js scene is heavy — load it client-side only, after hydration.
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

export default function Hero3D({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <HeroScene />
    </div>
  );
}
