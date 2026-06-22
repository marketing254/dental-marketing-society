"use client";

import type { ReactNode } from "react";
import Reveal from "@/components/motion/Reveal";
import FlowLines from "@/components/motion/FlowLines";

/** Centered inner-page hero over the flowing-line background. */
export default function PageHero({
  kicker,
  title,
  lead,
  children,
}: {
  kicker: string;
  title: ReactNode;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative -mt-[110px] overflow-hidden pb-12 pt-[170px] text-center sm:pt-[200px]">
      <FlowLines />
      <div className="container-x relative mx-auto max-w-4xl">
        <Reveal>
          <span className="kicker kicker-center">{kicker}</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="h-display mx-auto mt-5 max-w-3xl text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </Reveal>
        {lead && (
          <Reveal delay={0.2}>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-mist">
              {lead}
            </p>
          </Reveal>
        )}
        {children && (
          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap justify-center gap-4">{children}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
