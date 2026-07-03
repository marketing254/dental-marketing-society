"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import FlowLines from "@/components/motion/FlowLines";
import Reveal from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";
import EventCover from "@/components/EventCover";
import { Section, SectionHead } from "@/components/Section";
import { EventCard, HeroEventCard, CtaBand } from "@/components/blocks";
import { useUpcomingEvents, useArchive } from "@/lib/useDmsData";
import { slugify } from "@/lib/slug";

const REPLAYS_PER_PAGE = 6;

function Pagination({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (p: number) => void;
}) {
  const btn =
    "flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-semibold transition-colors";
  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => onChange(Math.max(0, page - 1))}
        disabled={page === 0}
        className={`${btn} border-white/12 text-mist hover:border-gold-400/50 hover:text-gold-300 disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Previous page"
      >
        <Icon name="back" size={16} />
      </button>
      {Array.from({ length: pages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          aria-current={i === page}
          className={`${btn} ${
            i === page
              ? "border-gold-400/60 bg-gold-500/15 text-gold-200"
              : "border-white/12 text-mist hover:border-gold-400/50 hover:text-gold-300"
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(pages - 1, page + 1))}
        disabled={page === pages - 1}
        className={`${btn} border-white/12 text-mist hover:border-gold-400/50 hover:text-gold-300 disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Next page"
      >
        <Icon name="arrow" size={16} />
      </button>
    </div>
  );
}

export default function EventsView() {
  const events = useUpcomingEvents();
  const archive = useArchive();
  const heroEvent = events[0];

  const [page, setPage] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const paginate = archive.length > REPLAYS_PER_PAGE;
  const pages = Math.max(1, Math.ceil(archive.length / REPLAYS_PER_PAGE));
  useEffect(() => {
    if (page > pages - 1) setPage(0);
  }, [page, pages]);
  const current = paginate
    ? archive.slice(page * REPLAYS_PER_PAGE, page * REPLAYS_PER_PAGE + REPLAYS_PER_PAGE)
    : archive;
  const goTo = (p: number) => {
    setPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
              <EventCard
                key={ev.title}
                event={ev}
                delay={i * 0.1}
                index={i}
                href={`/webinars/${slugify(ev.title)}`}
              />
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
              <Icon name="lock" size={14} /> Replays are free, open one and enter your name &amp; email for instant access.
            </span>
          </Reveal>
          <div ref={gridRef} className="grid scroll-mt-28 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {current.map((item, i) => (
              <Reveal key={item.slug} delay={(i % 3) * 0.08} className="h-full">
                <TiltCard className="h-full">
                  <Link
                    href={`/replays/${item.slug}`}
                    className="glass group flex h-full flex-col overflow-hidden !rounded-3xl"
                  >
                    <div className="relative aspect-video w-full overflow-hidden">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <EventCover title={item.title} label="Replay" index={i} />
                      )}
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/50 bg-gold-500/20 text-gold-300 backdrop-blur transition-transform duration-300 group-hover:scale-110">
                          <Icon name="play" size={24} className="ml-1" />
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="font-mono text-xs tracking-wider text-gold-400">{item.date}</span>
                      <h3 className="h-display mt-2 text-xl leading-snug transition-colors group-hover:text-gold-200">
                        {item.title}
                      </h3>
                      {item.summary && (
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mist">
                          {item.summary}
                        </p>
                      )}
                      <div className="mt-auto pt-5">
                        <span className="btn-ghost btn-md w-full">
                          <Icon name="play" size={14} /> Watch Replay
                        </span>
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          {paginate && <Pagination page={page} pages={pages} onChange={goTo} />}
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
    </>
  );
}
