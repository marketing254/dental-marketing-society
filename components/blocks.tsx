"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Icon, { type IconName } from "@/components/Icon";
import TiltCard from "@/components/motion/TiltCard";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";
import EventCover from "@/components/EventCover";
import type { DmsEvent, Faq } from "@/lib/data";

/* ---------- Event card ---------- */

export function EventCard({
  event,
  delay = 0,
  index = 0,
  href,
}: {
  event: DmsEvent;
  delay?: number;
  index?: number;
  href?: string;
}) {
  const cover = (
    <div className="relative aspect-[1200/630] overflow-hidden">
      <EventCover
        title={event.title}
        label="Live Webinar"
        day={event.day}
        month={event.month}
        index={index}
        showTitle={false}
      />
    </div>
  );
  return (
    <Reveal delay={delay}>
      <TiltCard className="h-full">
        <article className="glass flex h-full flex-col overflow-hidden !rounded-3xl">
          {href ? <Link href={href} className="group block">{cover}</Link> : cover}
          <div className="flex flex-1 flex-col p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10">
                <span className="font-display text-2xl font-bold text-gold-300">{event.day}</span>
                <span className="text-[0.65rem] font-bold tracking-widest text-gold-400 uppercase">
                  {event.month}
                </span>
              </div>
              <h3 className="h-display pt-1 text-2xl leading-snug">
                {href ? (
                  <Link href={href} className="transition-colors hover:text-gold-200">
                    {event.title}
                  </Link>
                ) : (
                  event.title
                )}
              </h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-mist">{event.description}</p>
            {event.panelists && event.panelists.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {event.panelists.map((p) => (
                  <span key={p.name} className="chip">{p.name}</span>
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {event.time ? (
                <>
                  <span className="chip"><Icon name="clock" size={13} /> {event.time}</span>
                  {event.ceCredits && (
                    <span className="chip chip-gold"><Icon name="award" size={13} /> {event.ceCredits}</span>
                  )}
                </>
              ) : (
                <>
                  <span className="chip"><Icon name="video" size={13} /> Live online</span>
                  <span className="chip"><Icon name="replay" size={13} /> Replay access included</span>
                </>
              )}
            </div>
            <div className="mt-auto pt-6">
              <Link href={event.registerUrl} className="btn-gold btn-lg w-full">
                Reserve Your Free Seat <Icon name="arrow" size={16} />
              </Link>
            </div>
          </div>
        </article>
      </TiltCard>
    </Reveal>
  );
}

/* ---------- Hero event card (floating, 3D) ---------- */

export function HeroEventCard({ event }: { event: DmsEvent }) {
  return (
    <div className="relative">
      {/* Floating chips */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="glass animate-float-slow absolute -left-6 top-12 z-10 hidden items-center gap-3 !rounded-2xl px-4 py-3 lg:flex"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/15 text-gold-300">
          <Icon name="award" size={18} />
        </span>
        <span className="text-sm font-bold leading-tight">
          {event.ceCredits || "CE Credits"}
          <small className="block text-xs font-medium text-mist">Earned live</small>
        </span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="glass animate-float-slower absolute -right-5 bottom-24 z-10 hidden items-center gap-3 !rounded-2xl px-4 py-3 lg:flex"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-gold-300">
          <Icon name="trending" size={18} />
        </span>
        <span className="text-sm font-bold leading-tight">
          New patients
          <small className="block text-xs font-medium text-mist">Booked &amp; rising</small>
        </span>
      </motion.div>

      <TiltCard maxTilt={5}>
        <div className="glass-strong overflow-hidden">
          <div className="relative aspect-[1200/630]">
            <EventCover
              title={event.title}
              label="Next live webinar"
              day={event.day}
              month={event.month}
            />
          </div>
          <div className="p-6 sm:p-7">
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-2 font-semibold text-gold-300">
                <Icon name="calendar" size={15} /> {event.dateLabel}
              </span>
              {event.time && <span className="font-mono text-xs text-mist">{event.time}</span>}
            </div>
            <h3 className="h-display mt-3 text-3xl leading-tight">{event.title}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="chip chip-gold"><Icon name="award" size={13} /> {event.ceCredits || "CE Credits"}</span>
              <span className="chip"><Icon name="replay" size={13} /> Live + replay</span>
            </div>
            <Link href="/events#upcoming" className="btn-gold btn-lg mt-6 w-full">
              Register Free <Icon name="arrow" size={16} />
            </Link>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-mist">
              <Icon name="shield" size={13} /> Limited seats · 100% free to attend
            </p>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}

/* ---------- Feature card ---------- */

export function FeatureCard({
  icon,
  title,
  text,
  delay = 0,
  tag,
}: {
  icon: IconName;
  title: string;
  text: string;
  delay?: number;
  tag?: string;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <TiltCard className="h-full">
        <div className="glass h-full p-7 transition-colors duration-300 hover:border-gold-400/30">
          <div
            className="flex h-13 w-13 items-center justify-center rounded-2xl border border-gold-500/25 bg-gradient-to-br from-gold-500/15 to-transparent text-gold-300"
            style={{ transform: "translateZ(30px)" }}
          >
            <Icon name={icon} size={22} />
          </div>
          {tag && (
            <span className="chip chip-gold mt-4 text-[0.65rem]"><Icon name="clock" size={11} /> {tag}</span>
          )}
          <h3 className="h-display mt-4 text-2xl">{title}</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-mist">{text}</p>
        </div>
      </TiltCard>
    </Reveal>
  );
}

/* ---------- Stats band ---------- */

export function StatBand({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <Reveal>
      <div className="glass relative overflow-hidden !rounded-[2rem]">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(212_168_47/0.12),transparent_55%)]"
        />
        <div className="relative grid grid-cols-2 divide-white/8 lg:grid-cols-4 lg:divide-x">
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-10 text-center">
              <CountUp
                value={s.value}
                className="text-gold-grad font-display block text-4xl font-bold sm:text-5xl"
              />
              <span className="mt-2 block text-xs font-semibold tracking-wider text-mist uppercase">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- CTA band ---------- */

export function CtaBand({
  kicker,
  title,
  lead,
  primary,
  secondary,
  note,
}: {
  kicker: string;
  title: string;
  lead: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  note?: string;
}) {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-gold-500/20 px-7 py-16 text-center sm:px-14">
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950" />
            <div aria-hidden className="aurora-blob animate-aurora-a left-[10%] top-[-40%] h-[300px] w-[420px] bg-gold-500/20" />
            <div aria-hidden className="aurora-blob animate-aurora-b right-[5%] bottom-[-45%] h-[280px] w-[380px] bg-teal-400/10" />
            <span className="kicker kicker-center">{kicker}</span>
            <h2 className="h-display mx-auto mt-4 max-w-3xl text-4xl sm:text-5xl">{title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-mist">{lead}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href={primary.href} className="btn-gold btn-lg">
                {primary.label} <Icon name="arrow" size={16} />
              </Link>
              <Link href={secondary.href} className="btn-ghost btn-lg">
                {secondary.label}
              </Link>
            </div>
            {note && <p className="mt-5 text-xs text-mist-dark">{note}</p>}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Partners marquee ---------- */

export function PartnersMarquee({ partners }: { partners: { name: string; logo: string }[] }) {
  const items = [...partners, ...partners];
  return (
    <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className="animate-marquee flex w-max items-center gap-5">
        {items.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="glass flex h-20 w-44 shrink-0 items-center justify-center !rounded-2xl p-4 opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
          >
            <Image
              src={p.logo}
              alt={p.name}
              width={140}
              height={56}
              className="max-h-12 w-auto rounded-md object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- FAQ accordion ---------- */

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <Reveal key={f.question} delay={i * 0.05}>
          <details className="glass group overflow-hidden !rounded-2xl open:border-gold-400/30">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-semibold text-ivory [&::-webkit-details-marker]:hidden">
              {f.question}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-gold-300 transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="px-6 pb-5 text-sm leading-relaxed text-mist">{f.answer}</div>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
