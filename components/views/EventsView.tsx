"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import FlowLines from "@/components/motion/FlowLines";
import Reveal from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";
import { Section, SectionHead } from "@/components/Section";
import { EventCard, HeroEventCard, CtaBand } from "@/components/blocks";
import GateModal, { type GateTarget } from "@/components/GateModal";
import { useUpcomingEvents, useArchive } from "@/lib/useDmsData";

export default function EventsView() {
  const events = useUpcomingEvents();
  const archive = useArchive();
  const [gate, setGate] = useState<GateTarget | null>(null);
  const heroEvent = events[0];

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative -mt-[110px] overflow-hidden pb-24 pt-[170px] sm:pt-[190px]">
        <FlowLines />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950 to-transparent" />
        <div className="container-x relative grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <span className="kicker">Webinars &amp; Events</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="h-display mt-5 text-5xl leading-[1.05] sm:text-6xl">
                Live webinars &amp; the full{" "}
                <em className="text-shimmer not-italic">replay archive</em>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist">
                Register for an upcoming live session to earn free CE credits,
                or revisit any past webinar on demand. Unlock replays free with
                your name and email.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#upcoming" className="btn-gold btn-lg">
                  See Upcoming <Icon name="arrow" size={16} />
                </a>
                <a href="#archive" className="btn-ghost btn-lg">
                  Browse the Archive
                </a>
              </div>
            </Reveal>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {heroEvent && <HeroEventCard event={heroEvent} />}
          </motion.div>
        </div>
      </section>

      {/* ============ UPCOMING ============ */}
      <Section id="upcoming">
        <div className="container-x">
          <SectionHead
            kicker="Upcoming Webinars"
            title="Register for our upcoming webinars"
            lead="Enlighten your knowledge on digital marketing for your practice. Attend live to earn free CE credits, seats are limited."
          />
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {events.map((ev, i) => (
              <EventCard key={ev.title} event={ev} delay={i * 0.1} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* ============ ARCHIVE ============ */}
      <Section id="archive" soft>
        <div className="container-x">
          <SectionHead
            kicker="Webinar Archive"
            title="Catch up on past webinars"
            lead="Missed one? Every session is recorded. Unlock any replay free, we just need your name and email."
          />
          <Reveal className="mb-10 text-center">
            <span className="chip chip-gold !px-5 !py-2.5 !text-sm">
              <Icon name="lock" size={14} /> Replays are free, enter your name &amp; email for instant access.
            </span>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {archive.map((item, i) => (
              <Reveal key={item.slug} delay={(i % 3) * 0.08} className="h-full">
                <TiltCard className="h-full">
                  <div className="glass group flex h-full flex-col overflow-hidden !rounded-3xl">
                    <button
                      onClick={() => setGate({ title: item.title, slug: item.slug, vimeo: item.vimeo })}
                      className="relative block aspect-video w-full cursor-pointer overflow-hidden bg-gradient-to-br from-navy-700 via-navy-800 to-navy-950 text-left"
                      aria-label={`Watch replay: ${item.title}`}
                    >
                      <span
                        aria-hidden
                        className="font-display absolute inset-0 flex items-center justify-center text-3xl tracking-[0.3em] text-white/[0.06] uppercase"
                      >
                        DMS
                      </span>
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-navy-950/70 px-3 py-1 text-[0.65rem] font-bold tracking-wider uppercase backdrop-blur">
                        <Icon name="lock" size={11} /> Replay
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/50 bg-gold-500/20 text-gold-300 backdrop-blur transition-transform duration-300 group-hover:scale-110">
                          <Icon name="play" size={24} className="ml-1" />
                        </span>
                      </span>
                    </button>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="font-mono text-xs tracking-wider text-gold-400">{item.date}</span>
                      <h3 className="h-display mt-2 text-xl leading-snug">{item.title}</h3>
                      <div className="mt-auto pt-5">
                        <button
                          onClick={() => setGate({ title: item.title, slug: item.slug, vimeo: item.vimeo })}
                          className="btn-ghost btn-md w-full"
                        >
                          <Icon name="lock" size={14} /> Watch Replay
                        </button>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ============ CTA ============ */}
      <CtaBand
        kicker="Never miss a session"
        title="Get every new webinar in your inbox"
        lead="Register for upcoming live webinars to earn free CE credits, and get replay links delivered automatically."
        primary={{ href: "/events#upcoming", label: "See Upcoming Webinars" }}
        secondary={{ href: "/#contact", label: "Subscribe to Updates" }}
      />

      <GateModal target={gate} onClose={() => setGate(null)} />
    </>
  );
}
