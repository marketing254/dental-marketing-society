"use client";

import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icon";
import FlowLines from "@/components/motion/FlowLines";
import Reveal from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";
import EventCover from "@/components/EventCover";
import { Section, SectionHead } from "@/components/Section";
import { CtaBand } from "@/components/blocks";
import { useWebinar, useUpcomingEvents } from "@/lib/useDmsData";
import { slugify } from "@/lib/slug";
import type { DmsEvent } from "@/lib/data";

const BENEFITS = [
  ["Practical takeaways", "Strategies you can apply in your practice the very next week."],
  ["Free CE credits", "Attend live to qualify for 2 free continuing-education credits."],
  ["Replay included", "Can't make it live? Every registrant gets the replay link."],
];

export default function WebinarDetailView({
  slug,
  initial = null,
}: {
  slug: string;
  initial?: DmsEvent | null;
}) {
  const live = useWebinar(slug);
  const event = live ?? initial;
  const all = useUpcomingEvents();
  const more = all.filter((e) => slugify(e.title) !== slug).slice(0, 2);
  const registerUrl = event?.registerUrl || "/audit";

  return (
    <>
      <section className="relative -mt-[110px] overflow-hidden pb-10 pt-[170px] sm:pt-[200px]">
        <FlowLines />
        <div className="container-x relative mx-auto max-w-5xl">
          <Reveal>
            <Link
              href="/events#upcoming"
              className="inline-flex items-center gap-1.5 text-sm text-mist transition-colors hover:text-gold-300"
            >
              <Icon name="back" size={15} /> All upcoming webinars
            </Link>
          </Reveal>

          {!event ? (
            <Reveal delay={0.1}>
              <h1 className="h-display mt-6 text-4xl sm:text-5xl">Webinar not found</h1>
              <Link href="/events#upcoming" className="btn-gold btn-lg mt-6">
                See Upcoming Webinars <Icon name="arrow" size={16} />
              </Link>
            </Reveal>
          ) : (
            <div className="mt-6 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <Reveal>
                  <span className="chip chip-gold">
                    <span className="live-dot" /> Live Webinar
                  </span>
                </Reveal>
                <Reveal delay={0.1}>
                  <h1 className="h-display mt-4 text-4xl leading-[1.1] sm:text-5xl">
                    {event.title}
                  </h1>
                </Reveal>
                <Reveal delay={0.2}>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-mist">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="calendar" size={15} /> {event.dateLabel}
                    </span>
                    {event.time && (
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="clock" size={15} /> {event.time}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="award" size={15} /> 2 CE Credits
                    </span>
                  </div>
                </Reveal>
                {event.description && (
                  <Reveal delay={0.25}>
                    <p className="mt-5 max-w-xl leading-relaxed text-mist">{event.description}</p>
                  </Reveal>
                )}
                {event.panelists && event.panelists.length > 0 && (
                  <Reveal delay={0.3}>
                    <div className="mt-6">
                      <p className="font-mono text-xs tracking-[0.2em] text-mist uppercase">Panelists</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {event.panelists.map((p) => (
                          <span key={p} className="chip">
                            <Icon name="users" size={13} /> {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                )}
                <Reveal delay={0.35}>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link href={registerUrl} className="btn-gold btn-lg">
                      Reserve Your Free Seat <Icon name="arrow" size={16} />
                    </Link>
                    <Link href="/events#upcoming" className="btn-ghost btn-lg">
                      Other Webinars
                    </Link>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.2}>
                <TiltCard maxTilt={5}>
                  <div className="glass-strong overflow-hidden !rounded-[1.8rem] p-2.5">
                    <div className="relative aspect-[1200/630] overflow-hidden rounded-[1.4rem]">
                      {event.image ? (
                        <Image src={event.image} alt={event.title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
                      ) : (
                        <EventCover title={event.title} label="Live Webinar" day={event.day} month={event.month} />
                      )}
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {event && (
        <>
          <Section soft>
            <div className="container-x">
              <SectionHead kicker="Why attend" title="What you'll walk away with" />
              <div className="grid gap-6 md:grid-cols-3">
                {BENEFITS.map(([title, text], i) => (
                  <Reveal key={title} delay={i * 0.1} className="h-full">
                    <div className="glass h-full p-7">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-500/25 bg-gradient-to-br from-gold-500/15 to-transparent text-gold-300">
                        <Icon name="check" size={20} />
                      </div>
                      <h3 className="h-display mt-4 text-xl">{title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-mist">{text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Section>

          {more.length > 0 && (
            <Section>
              <div className="container-x">
                <SectionHead kicker="Also coming up" title="More upcoming webinars" />
                <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
                  {more.map((e, i) => (
                    <Reveal key={e.title} delay={i * 0.1} className="h-full">
                      <TiltCard className="h-full">
                        <Link href={`/webinars/${slugify(e.title)}`} className="glass flex h-full flex-col overflow-hidden !rounded-3xl">
                          <div className="relative aspect-[1200/630] overflow-hidden">
                            <EventCover title={e.title} label="Live Webinar" day={e.day} month={e.month} index={i + 1} />
                          </div>
                          <div className="p-6">
                            <span className="font-mono text-xs tracking-wider text-gold-400">{e.dateLabel}</span>
                            <h3 className="h-display mt-2 text-lg leading-snug">{e.title}</h3>
                          </div>
                        </Link>
                      </TiltCard>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Section>
          )}

          <CtaBand
            kicker="Don't miss it"
            title="Reserve your free seat"
            lead="Seats are limited and every session is 100% free. Register now and add it to your calendar."
            primary={{ href: registerUrl, label: "Register Free" }}
            secondary={{ href: "/events#archive", label: "Browse Replays" }}
          />
        </>
      )}
    </>
  );
}
