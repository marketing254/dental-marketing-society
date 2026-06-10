"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Icon, { type IconName } from "@/components/Icon";
import BeamField from "@/components/motion/BeamField";
import Reveal from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";
import { Section, SectionHead } from "@/components/Section";
import { FeatureCard } from "@/components/blocks";
import SpeakerForm from "@/components/forms/SpeakerForm";

const VALUE_PROPS: { icon: IconName; title: string; text: string }[] = [
  { icon: "users", title: "Engaged Audience", text: "Reach dentists and practice owners actively investing in growing their practices." },
  { icon: "replay", title: "Live + On-Demand", text: "Your session airs live and lives on as an evergreen replay in our archive." },
  { icon: "shield", title: "Pro Production", text: "We handle the tech, promotion, hosting, and editing, you just show up and share." },
  { icon: "award", title: "CE-Accredited", text: "Present on a PACE-accredited education platform dentists trust." },
];

const BENEFITS: { icon: IconName; title: string; text: string }[] = [
  { icon: "award", title: "Build Authority", text: "Position yourself as a trusted voice in the dental community." },
  { icon: "target", title: "Reach the Right People", text: "Get in front of decision-makers who run and grow dental practices." },
  { icon: "globe", title: "Multi-Platform Reach", text: "Your talk is promoted across email, social, and our webinar library." },
  { icon: "video", title: "Professional Recording", text: "Walk away with a polished recording you can share and reuse." },
  { icon: "replay", title: "Evergreen Value", text: "Replays keep working for you long after the live session ends." },
  { icon: "trending", title: "Grow Your Network", text: "Connect with practice owners, peers, and the wider DMS community." },
];

const TOPICS: { icon: IconName; label: string }[] = [
  { icon: "trending", label: "Practice Marketing" },
  { icon: "users", label: "Patient Acquisition" },
  { icon: "award", label: "Leadership & Culture" },
  { icon: "briefcase", label: "Team & Systems" },
  { icon: "chart", label: "Practice Finance" },
  { icon: "spark", label: "AI & Technology" },
  { icon: "target", label: "Treatment Acceptance" },
  { icon: "shield", label: "Insurance & PPO Strategy" },
];

const IDEAL: { icon: IconName; title: string; text: string }[] = [
  { icon: "tooth", title: "Practice Owners", text: "Dentists with hard-won lessons and systems worth sharing." },
  { icon: "briefcase", title: "Industry Consultants", text: "Coaches and consultants who help practices grow and thrive." },
  { icon: "trending", title: "Marketing & Growth Experts", text: "Specialists with proven, actionable strategies for dental practices." },
  { icon: "spark", title: "Dental Tech Founders", text: "Innovators building tools that move the profession forward." },
];

export default function SpeakerView() {
  return (
    <>
      {/* ============ HERO + APPLICATION FORM ============ */}
      <section className="relative -mt-[110px] overflow-hidden pb-24 pt-[170px] sm:pt-[190px]">
        <BeamField />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950 to-transparent" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-2">
          <div>
            <Reveal>
              <span className="kicker">Guest Speakers</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="h-display mt-5 text-5xl leading-[1.06] sm:text-6xl">
                Share your expertise with{" "}
                <em className="text-gold-grad not-italic">dental practice owners</em>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist">
                Join our roster of expert speakers and reach an engaged audience
                of dentists and practice owners through our live webinars and
                on-demand replays. We handle the promotion, tech, and
                production, you bring the insight.
              </p>
            </Reveal>
            <Reveal delay={0.28}>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <span className="chip"><Icon name="users" size={13} /> Engaged dental audience</span>
                <span className="chip"><Icon name="replay" size={13} /> Live + replay reach</span>
                <span className="chip"><Icon name="award" size={13} /> CE-accredited platform</span>
              </div>
            </Reveal>
            <Reveal delay={0.36}>
              <div className="mt-8 flex items-center gap-4">
                <Image
                  src="/assets/naren.jpg"
                  alt="Naren Arulrajah"
                  width={52}
                  height={52}
                  className="h-13 w-13 rounded-full border-2 border-gold-500/40 object-cover"
                />
                <span className="text-sm text-mist">
                  Hosted by <b className="block text-ivory">Naren Arulrajah</b>
                  Founder, Dental Marketing Society
                </span>
              </div>
            </Reveal>
          </div>

          <motion.div
            id="apply"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="scroll-mt-32"
          >
            <SpeakerForm />
          </motion.div>
        </div>
      </section>

      {/* ============ VALUE PROPS ============ */}
      <Section id="why">
        <div className="container-x">
          <SectionHead
            kicker="Why speak with us"
            title="A platform built for impact"
            lead="Everything you need to share your message with the right audience, and have it work for you long after."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((v, i) => (
              <FeatureCard key={v.title} icon={v.icon} title={v.title} text={v.text} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </Section>

      {/* ============ BENEFITS ============ */}
      <Section soft>
        <div className="container-x">
          <SectionHead kicker="The benefits" title="What you'll gain as a speaker" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b, i) => (
              <FeatureCard key={b.title} icon={b.icon} title={b.title} text={b.text} delay={(i % 3) * 0.1} />
            ))}
          </div>
        </div>
      </Section>

      {/* ============ TOPICS ============ */}
      <Section>
        <div className="container-x">
          <SectionHead
            kicker="Topics we love"
            title="What could you speak about?"
            lead="A few of the themes that resonate with our audience, yours may be different, and that's welcome."
          />
          <Reveal>
            <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
              {TOPICS.map((t) => (
                <span
                  key={t.label}
                  className="chip !px-5 !py-3 !text-sm transition-all hover:-translate-y-0.5 hover:border-gold-400/50 hover:text-gold-300"
                >
                  <Icon name={t.icon} size={15} /> {t.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ============ IDEAL SPEAKERS ============ */}
      <Section soft>
        <div className="container-x">
          <SectionHead kicker="Who should apply" title="Our ideal speakers" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {IDEAL.map((s, i) => (
              <FeatureCard key={s.title} icon={s.icon} title={s.title} text={s.text} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </Section>

      {/* ============ MEET YOUR HOST ============ */}
      <Section id="host">
        <div className="container-x">
          <SectionHead kicker="Meet your host" title="You'll be in good company" />
          <Reveal>
            <TiltCard className="mx-auto max-w-md" maxTilt={5}>
              <div className="glass overflow-hidden !rounded-[2rem] text-center">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/assets/naren.jpg"
                    alt="Naren Arulrajah"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, 448px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
                  <span className="chip chip-gold absolute left-1/2 top-4 -translate-x-1/2 !text-[0.65rem] uppercase tracking-widest">
                    Your Host
                  </span>
                </div>
                <div className="p-7">
                  <h3 className="h-display text-3xl">Naren Arulrajah</h3>
                  <p className="mt-1 text-sm text-gold-300">Founder, Dental Marketing Society</p>
                  <ul className="mt-5 space-y-2.5 text-left text-sm text-mist">
                    {[
                      "Founder / CEO of Ekwa Marketing",
                      "15+ years in dental marketing",
                      "Co-host, Less Insurance Dependence Podcast",
                      "Has helped hundreds of practices grow",
                    ].map((c) => (
                      <li key={c} className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-300">
                          <Icon name="check" size={10} />
                        </span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TiltCard>
          </Reveal>
          <Reveal className="mt-12 text-center">
            <a href="#apply" className="btn-gold btn-lg">
              Apply to Speak <Icon name="arrow" size={16} />
            </a>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
