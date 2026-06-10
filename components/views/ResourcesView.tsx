"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import FlowLines from "@/components/motion/FlowLines";
import Reveal from "@/components/motion/Reveal";
import { Section, SectionHead } from "@/components/Section";
import { FeatureCard } from "@/components/blocks";
import NewsletterForm from "@/components/forms/NewsletterForm";

export default function ResourcesView() {
  return (
    <>
      {/* ============ COMING SOON HERO ============ */}
      <section className="relative -mt-[110px] overflow-hidden pb-24 pt-[170px] text-center sm:pt-[190px]">
        <FlowLines />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950 to-transparent" />
        <div className="container-x relative mx-auto max-w-3xl">
          <Reveal>
            <span className="chip chip-gold !px-4 !py-2 !text-[0.8rem]">
              <Icon name="clock" size={14} /> Coming Soon
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="h-display mt-6 text-5xl leading-[1.06] sm:text-6xl">
              Our resource library is <em className="text-gold-grad not-italic">on the way</em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-mist">
              We&apos;re building a hub of marketing know-how for dental practice
              owners, articles, downloadable guides, handy tools, and a podcast.
              It&apos;s almost ready.
            </p>
          </Reveal>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong relative mx-auto mt-10 max-w-lg p-7 text-left"
          >
            <h3 className="h-display text-center text-2xl">Be the first to know</h3>
            <p className="mb-5 mt-1 text-center text-sm text-mist">
              Drop your email and we&apos;ll let you know the moment it goes live.
            </p>
            <NewsletterForm
              source="resources-notify"
              buttonLabel="Notify Me"
              doneLabel="Thanks! We'll be in touch."
            />
          </motion.div>

          <Reveal delay={0.45}>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/" className="btn-ghost btn-lg">
                <Icon name="back" size={16} /> Back to Home
              </Link>
              <Link href="/events" className="btn-gold btn-lg">
                Browse Webinars
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ WHAT'S COMING ============ */}
      <Section>
        <div className="container-x">
          <SectionHead
            kicker="What's coming"
            title="Inside the resource library"
            lead="Here's a preview of what you'll find when it launches."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon="book" tag="Coming soon" title="Blog & Insights" text="Marketing articles and growth insights written for dental practices." />
            <FeatureCard icon="download" tag="Coming soon" title="Free Downloads" text="Checklists, templates, and guides you can put to work right away." delay={0.08} />
            <FeatureCard icon="tool" tag="Coming soon" title="Practice Tools" text="Handy tools to plan, measure, and grow your marketing." delay={0.16} />
            <FeatureCard icon="mic" tag="Coming soon" title="Podcast" text="Conversations with dental marketing leaders, on demand." delay={0.24} />
          </div>
        </div>
      </Section>
    </>
  );
}
