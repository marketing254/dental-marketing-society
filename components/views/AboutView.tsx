"use client";

import Link from "next/link";
import Image from "next/image";
import Icon, { type IconName } from "@/components/Icon";
import FlowLines from "@/components/motion/FlowLines";
import Reveal from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";
import { Section, SectionHead } from "@/components/Section";
import { FeatureCard, StatBand, CtaBand } from "@/components/blocks";
import { useTeam, useReviews } from "@/lib/useDmsData";
import { asset } from "@/lib/asset";

const VALUES: { icon: IconName; title: string; text: string }[] = [
  { icon: "heart", title: "Service to others", text: "A genuine commitment to helping practice owners succeed, consulting and coaching taken to heart." },
  { icon: "spark", title: "Genuine fulfillment", text: "The belief that everyone should find real fulfillment in their work and their life." },
  { icon: "trending", title: "Leading-edge education", text: "Sharing the most effective, up-to-date digital marketing strategies, tailored to each practice." },
];

const VENTURES: { icon: IconName; title: string; text: string }[] = [
  { icon: "briefcase", title: "Ekwa Marketing", text: "Founder / CEO, website design, development, and full-service digital marketing for dental practices." },
  { icon: "book", title: "Thriving Practice Academy", text: "Founder, education and resources to help practices grow sustainably." },
  { icon: "heart", title: "iLoveDentistry", text: "Co-Founder, a community celebrating and supporting the dental profession." },
  { icon: "mic", title: "Less Insurance Dependence Podcast", text: "Co-host, practical guidance on reducing PPO dependency." },
  { icon: "tooth", title: "Dental Marketing Society", text: "Founder, the educational platform you're reading right now." },
  { icon: "globe", title: "And growing", text: "New initiatives, all driven by the same commitment to genuine service." },
];

export default function AboutView() {
  const team = useTeam();
  const reviews = useReviews("about");

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative -mt-[110px] overflow-hidden pb-20 pt-[170px] text-center sm:pt-[190px]">
        <FlowLines />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950 to-transparent" />
        <div className="container-x relative mx-auto max-w-4xl">
          <Reveal>
            <span className="kicker kicker-center">About Us</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="h-display mt-5 text-5xl leading-[1.06] sm:text-6xl lg:text-7xl">
              The best in <em className="text-shimmer not-italic">dental digital marketing</em> education
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-mist">
              Dental Marketing Society is an educational platform striving to
              offer you the best in dental digital marketing education. Explore
              the secrets to supercharge your practice&apos;s growth with highly
              effective strategies tailored just for you.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link href="/events#upcoming" className="btn-gold btn-lg">
                Request Free Webinars <Icon name="arrow" size={16} />
              </Link>
              <a href="#founder" className="btn-ghost btn-lg">
                Meet Our Founder
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ MISSION ============ */}
      <Section className="!py-16">
        <div className="container-x mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="kicker kicker-center">Our Mission</span>
            <h2 className="h-display mt-4 text-4xl sm:text-5xl">Built to help good practices grow</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-mist">
              We believe great practices run on trust and relationships, not
              one-time visits. The Society exists to put proven, leading-edge
              digital marketing knowledge into the hands of practice owners, so
              the dentists who care most about their patients are also the ones
              those patients can find.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ============ FOUNDER ============ */}
      <Section id="founder" soft>
        <div className="container-x grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <TiltCard maxTilt={5}>
              <div className="relative mx-auto max-w-sm">
                <div
                  aria-hidden
                  className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-gold-500/25 via-transparent to-teal-400/15 blur-2xl"
                />
                <div className="glass overflow-hidden !rounded-[2rem] p-2">
                  <Image
                    src={asset("/assets/naren.jpg")}
                    alt="Naren Arulrajah, Founder of Dental Marketing Society"
                    width={600}
                    height={600}
                    className="w-full rounded-[1.6rem] object-cover"
                  />
                </div>
                <div className="glass absolute -bottom-5 left-1/2 flex w-max -translate-x-1/2 items-center gap-2 !rounded-full px-5 py-3 text-sm font-bold text-gold-300">
                  <Icon name="award" size={16} /> 15+ Years in Dentistry
                </div>
              </div>
            </TiltCard>
          </Reveal>
          <Reveal delay={0.15}>
            <span className="kicker">Meet the Founder</span>
            <h2 className="h-display mt-4 text-4xl sm:text-5xl">Naren Arulrajah</h2>
            <p className="font-display mt-2 text-lg font-bold text-gold-300">
              Founder of Dental Marketing Society · Digital Marketing Guru
            </p>
            <p className="mt-5 leading-relaxed text-mist">
              As Founder/CEO of Ekwa Marketing, Naren has helped hundreds of
              dental practices reach a higher pinnacle of success through
              website design and development and a multitude of leading-edge
              digital marketing platforms. With a deep passion for service to
              others, Naren takes consulting and coaching to heart. He believes
              that everyone should find genuine fulfillment in their jobs and
              life, and has taken several initiatives to accomplish that
              purpose.
            </p>
            <ul className="mt-8 space-y-5">
              {[
                ["Founder / CEO, Ekwa Marketing", "Helping hundreds of practices grow through digital marketing."],
                ["Co-host, Less Insurance Dependence Podcast", "Helping practices reduce PPO dependency."],
                ["Founder, Thriving Practice Academy", "Education for sustainable practice growth."],
              ].map(([title, text]) => (
                <li key={title} className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-300">
                    <Icon name="check" size={13} />
                  </span>
                  <div>
                    <b className="block text-ivory">{title}</b>
                    <span className="text-sm text-mist">{text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* ============ VALUES ============ */}
      <Section>
        <div className="container-x">
          <SectionHead
            kicker="What drives us"
            title="A deep passion for service"
            lead="The principles behind everything the Society does."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <FeatureCard key={v.title} icon={v.icon} title={v.title} text={v.text} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </Section>

      {/* ============ VENTURES ============ */}
      <Section soft>
        <div className="container-x">
          <SectionHead
            kicker="The work behind the mission"
            title="Initiatives Naren has built"
            lead="Several ventures, one purpose, helping dentists thrive."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VENTURES.map((v, i) => (
              <FeatureCard key={v.title} icon={v.icon} title={v.title} text={v.text} delay={(i % 3) * 0.1} />
            ))}
          </div>
        </div>
      </Section>

      {/* ============ IMPACT ============ */}
      <Section className="!py-6">
        <div className="container-x">
          <StatBand
            stats={[
              { value: "Hundreds", label: "Of practices helped" },
              { value: "15+", label: "Years in dentistry" },
              { value: "5+", label: "Ventures founded" },
              { value: "100%", label: "Service-driven" },
            ]}
          />
        </div>
      </Section>

      {/* ============ TEAM ============ */}
      <Section id="team" soft>
        <div className="container-x">
          <SectionHead
            kicker="Meet the team"
            title="The people behind the Society"
            lead="A small, dedicated team working to help dental practice owners learn, connect, and grow."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.1} className="h-full">
                <TiltCard className="h-full">
                  <div className="glass h-full p-7 text-center">
                    {m.photo ? (
                      <Image
                        src={m.photo}
                        alt={m.name}
                        width={120}
                        height={120}
                        className="mx-auto h-28 w-28 rounded-full border-2 border-gold-500/40 object-cover"
                      />
                    ) : (
                      <div className="font-display mx-auto flex h-28 w-28 items-center justify-center rounded-full border-2 border-gold-500/40 bg-navy-800 text-4xl text-gold-300">
                        {m.name.split(/\s+/).map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                    )}
                    <h4 className="h-display mt-5 text-2xl">{m.name}</h4>
                    <span className="mt-1 block font-mono text-xs tracking-wider text-gold-400 uppercase">
                      {m.role}
                    </span>
                    <p className="mt-4 text-sm leading-relaxed text-mist">{m.bio}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ============ PROOF ============ */}
      <Section>
        <div className="container-x">
          <SectionHead
            kicker="Proof"
            title="What dentists say about Naren"
            lead="In the words of the practice owners he's worked with."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={i} delay={i * 0.1} className="h-full">
                <TiltCard className="h-full">
                  <figure className="glass relative h-full p-7">
                    <span aria-hidden className="text-gold-grad font-display absolute -top-2 right-6 text-7xl">
                      ”
                    </span>
                    <div className="text-gold-400">★★★★★</div>
                    <blockquote className="mt-4 text-sm leading-relaxed text-ivory/90">{r.text}</blockquote>
                    <figcaption className="mt-6 border-t border-white/8 pt-5">
                      <b className="block text-sm">{r.name}</b>
                      <small className="text-xs text-mist">{r.firm}</small>
                    </figcaption>
                  </figure>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ============ CTA ============ */}
      <CtaBand
        kicker="Join the Society"
        title="Ready to supercharge your practice's growth?"
        lead="Register for our free webinars, or claim a complimentary practice audit, and put these strategies to work in your practice."
        primary={{ href: "/events#upcoming", label: "Request Free Webinars" }}
        secondary={{ href: "/msm", label: "Claim a Free Audit" }}
      />
    </>
  );
}
