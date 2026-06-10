"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import Icon, { type IconName } from "@/components/Icon";
import BeamField from "@/components/motion/BeamField";
import Reveal from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";
import { Section, SectionHead } from "@/components/Section";
import { FeatureCard, StatBand, CtaBand } from "@/components/blocks";
import { useReviews } from "@/lib/useDmsData";
import { SITE } from "@/lib/site";

const INCLUDED: { icon: IconName; title: string; text: string }[] = [
  { icon: "users", title: "Patient Quality Audit", text: "A clear look at where your patients come from and how treatment acceptance is trending." },
  { icon: "search", title: "Google SEO & Visibility", text: "Which search terms you dominate, where you're invisible, and your local visibility score." },
  { icon: "shield", title: "PPO Vulnerability Check", text: "How dependent you are on insurance, and a plan to reduce it profitably." },
  { icon: "target", title: "Competitive Landscape", text: "Where competitors are winning patients you could be capturing instead." },
  { icon: "eye", title: "Website & Pre-Suasion Review", text: "How well your site builds trust and converts visitors into booked patients." },
  { icon: "trending", title: "Custom Growth Roadmap", text: "A tailored action plan you keep, whether or not we ever work together." },
];

const STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: "calendar", title: "Pick your time", text: "Choose a date and time above, under 60 seconds, no payment required." },
  { icon: "research", title: "We do the research", text: "Our team runs 4-5 hours of deep pre-audit analysis on your practice." },
  { icon: "trending", title: "Get your roadmap", text: "Walk away with a personalised growth plan that's yours to keep." },
];

export default function AuditView() {
  const reviews = useReviews("audit");
  const review = reviews[0];
  const [schedLoaded, setSchedLoaded] = useState(false);

  return (
    <>
      {/* ============ HERO + SCHEDULER ============ */}
      <section id="book" className="relative -mt-[110px] overflow-hidden pb-24 pt-[160px] sm:pt-[180px]">
        <BeamField />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950 to-transparent" />
        <div className="container-x relative grid items-start gap-14 lg:grid-cols-[1fr_1fr]">
          <div className="pt-4">
            <Reveal>
              <Link
                href="/"
                className="chip mb-6 transition-colors hover:border-gold-400/40 hover:text-ivory"
              >
                <Icon name="back" size={13} /> Back to Dental Marketing Society
              </Link>
            </Reveal>
            <Reveal delay={0.05}>
              <span className="chip chip-gold !px-4 !py-2 !text-[0.8rem]">
                <Icon name="award" size={14} /> Free 45-min session · $900 value
              </span>
            </Reveal>
            <Reveal delay={0.12}>
              <h1 className="h-display mt-6 text-5xl leading-[1.06] sm:text-6xl">
                Are your patients finding you for{" "}
                <em className="text-gold-grad not-italic">all the right reasons?</em>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist">
                Great practices run on trust and relationships, not one-time
                visits. In your <strong className="text-ivory">Complimentary Practice Audit Session</strong>,
                we show you exactly how to attract more of the patients you
                actually want.
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <span className="chip"><Icon name="check" size={13} /> No credit card</span>
                <span className="chip"><Icon name="check" size={13} /> No obligation</span>
                <span className="chip"><Icon name="check" size={13} /> 100% free</span>
                <span className="chip"><Icon name="clock" size={13} /> Limited to 5 / week</span>
              </div>
            </Reveal>
            <Reveal delay={0.34}>
              <div className="mt-8 flex items-center gap-4">
                <span className="font-display flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 text-lg font-bold text-gold-300">
                  NA
                </span>
                <span className="text-sm text-mist">
                  Hosted by <b className="block text-ivory">Naren Arulrajah</b>
                  15+ years in dental marketing
                </span>
              </div>
            </Reveal>
          </div>

          {/* Scheduler card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div
              aria-hidden
              className="absolute -inset-3 -z-10 rounded-[2.5rem] bg-gradient-to-br from-gold-500/30 via-transparent to-teal-400/20 blur-2xl"
            />
            <div className="glass-strong relative overflow-hidden">
              <div className="bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 px-6 py-2.5 text-center text-xs font-bold tracking-wider text-navy-950 uppercase">
                ★ Only 5 audits available each week
              </div>
              <div className="p-6 sm:p-7">
                <h3 className="h-display text-3xl">Pick your time</h3>
                <p className="mt-1.5 text-sm text-mist">
                  Choose a slot below, it takes under 60 seconds, with no payment.
                </p>
                <div className="relative mt-5 h-[560px] overflow-hidden rounded-2xl border border-white/10 bg-white">
                  {!schedLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-navy-900 text-sm text-mist">
                      <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
                      Loading secure scheduler…
                    </div>
                  )}
                  <iframe
                    title="Book your Practice Growth Audit"
                    src={SITE.schedulerUrl}
                    loading="lazy"
                    onLoad={() => setSchedLoaded(true)}
                    className={`h-full w-full transition-opacity duration-500 ${schedLoaded ? "opacity-100" : "opacity-0"}`}
                  />
                </div>
                <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-mist-dark">
                  <Icon name="lock" size={12} /> Secure scheduling by YouCanBook.me
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ REVIEW ============ */}
      {review && (
        <Section soft>
          <div className="container-x mx-auto max-w-3xl">
            <SectionHead kicker="What clients say" title="Straight from a recent strategy call" />
            <Reveal>
              <TiltCard maxTilt={4}>
                <figure className="glass relative p-9 text-center sm:p-12">
                  <span className="chip mx-auto">
                    <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden="true">
                      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z" />
                      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-2.6-11.3-7l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.3 5.2C39.8 36.7 44 31 44 24c0-1.3-.1-2.5-.4-3.5z" />
                    </svg>
                    Verified Google review
                  </span>
                  <div className="mt-4 text-lg text-gold-400">★★★★★</div>
                  <blockquote className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ivory/90">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6">
                    <b className="block">{review.name}</b>
                    <small className="text-xs text-mist">
                      {review.firm} <span className="ml-1 rounded bg-teal-400/15 px-1.5 py-0.5 text-[0.6rem] font-bold text-teal-400">NEW</span>
                    </small>
                  </figcaption>
                </figure>
              </TiltCard>
            </Reveal>
          </div>
        </Section>
      )}

      {/* ============ WHAT'S INCLUDED ============ */}
      <Section>
        <div className="container-x">
          <SectionHead
            kicker="What you'll get"
            title="Six ways we'll map your growth"
            lead="Before your call, our team does 4-5 hours of research on your practice, so your session is built entirely around you."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map((f, i) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} text={f.text} delay={(i % 3) * 0.1} />
            ))}
          </div>
        </div>
      </Section>

      {/* ============ HOW IT WORKS ============ */}
      <Section soft>
        <div className="container-x">
          <SectionHead kicker="How it works" title="Three simple steps" />
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <TiltCard className="h-full">
                  <div className="glass relative h-full p-7 text-center">
                    <span className="text-gold-grad font-display absolute right-5 top-3 text-5xl font-bold opacity-30">
                      {i + 1}
                    </span>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-500/25 bg-gradient-to-br from-gold-500/15 to-transparent text-gold-300">
                      <Icon name={s.icon} size={26} />
                    </div>
                    <h4 className="h-display mt-5 text-2xl">{s.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-mist">{s.text}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <a href="#book" className="btn-gold btn-lg">
              Claim Your Free Audit <Icon name="arrow" size={16} />
            </a>
          </Reveal>
        </div>
      </Section>

      {/* ============ STATS ============ */}
      <Section className="!py-6">
        <div className="container-x">
          <StatBand
            stats={[
              { value: "500+", label: "Practices served" },
              { value: "Top 5%", label: "Google rankings achieved" },
              { value: "+40%", label: "Average new-patient growth" },
              { value: "4.9★", label: "Average client rating" },
            ]}
          />
        </div>
      </Section>

      {/* ============ CTA ============ */}
      <CtaBand
        kicker="Limited availability"
        title="Ready to claim your complimentary audit?"
        lead="Only 5 free Practice Growth Audits are available each week, and they fill quickly. Choose your time, our team handles the rest."
        primary={{ href: "#book", label: "Pick Your Time" }}
        secondary={{ href: "/", label: "Back to Home" }}
        note="No credit card · No obligation · 100% free"
      />
    </>
  );
}
