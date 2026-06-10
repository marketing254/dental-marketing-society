"use client";

import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import FlowLines from "@/components/motion/FlowLines";
import Reveal from "@/components/motion/Reveal";
import { Section } from "@/components/Section";
import ContactForm from "@/components/forms/ContactForm";
import { SITE } from "@/lib/site";

export default function ContactView() {
  return (
    <>
      {/* ============ HERO + FORM ============ */}
      <section className="relative -mt-[110px] overflow-hidden pb-24 pt-[170px] sm:pt-[190px]">
        <FlowLines />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950 to-transparent" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-2">
          <div>
            <Reveal>
              <span className="kicker">Contact Us</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="h-display mt-5 text-6xl leading-[1.05] sm:text-7xl">
                Let&apos;s <em className="text-gold-grad not-italic">talk</em>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-mist">
                Questions about our webinars, the practice audit, or speaking
                with us? Reach out anytime, we read every message.
              </p>
            </Reveal>
            <Reveal delay={0.28}>
              <ul className="mt-8 space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-500/25 bg-gold-500/10 text-gold-300">
                    <Icon name="mail" size={16} />
                  </span>
                  <a href={`mailto:${SITE.email}`} className="text-ivory transition-colors hover:text-gold-300">
                    {SITE.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold-500/25 bg-gold-500/10 text-gold-300">
                    <Icon name="pin" size={16} />
                  </span>
                  <span className="pt-2 text-mist">{SITE.address}</span>
                </li>
              </ul>
            </Reveal>
            <Reveal delay={0.36}>
              <div className="mt-7 flex gap-2.5">
                {(["facebook", "instagram", "linkedin", "youtube"] as const).map((net) => (
                  <a
                    key={net}
                    href={SITE.social[net]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={net}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-mist transition-all hover:-translate-y-0.5 hover:border-gold-400/50 hover:text-gold-300"
                  >
                    <Icon name={net} size={17} />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>

      {/* ============ MAP ============ */}
      <Section className="!pt-4">
        <div className="container-x">
          <Reveal>
            <div className="glass overflow-hidden !rounded-[2rem] p-2">
              <iframe
                title="Dental Marketing Society location"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=303%20Pinetree%20Way%2C%20Mississauga%2C%20Ontario%20L5G%202R4%2C%20Canada&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="h-[420px] w-full rounded-[1.6rem] grayscale-[0.4] invert-[0.88] hue-rotate-180"
              />
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
