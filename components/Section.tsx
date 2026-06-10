import type { ReactNode } from "react";
import Reveal from "@/components/motion/Reveal";

export function Section({
  id,
  children,
  className = "",
  soft = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  soft?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-28 py-20 sm:py-28 ${
        soft ? "bg-gradient-to-b from-transparent via-navy-900/60 to-transparent" : ""
      } ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionHead({
  kicker,
  title,
  lead,
}: {
  kicker: string;
  title: ReactNode;
  lead?: string;
}) {
  return (
    <Reveal className="mx-auto mb-14 max-w-3xl text-center">
      <span className="kicker kicker-center">{kicker}</span>
      <h2 className="h-display mt-4 text-4xl sm:text-5xl">{title}</h2>
      {lead && <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-mist">{lead}</p>}
    </Reveal>
  );
}

/** Animated aurora background blobs for hero sections. */
export function Aurora() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <div className="aurora-blob animate-aurora-a left-[-10%] top-[-20%] h-[58vh] w-[52vw] bg-navy-600/35" />
      <div className="aurora-blob animate-aurora-b right-[-12%] top-[8%] h-[50vh] w-[42vw] bg-gold-600/10" />
    </div>
  );
}
